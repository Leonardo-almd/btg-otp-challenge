import { Test, TestingModule } from '@nestjs/testing';
import { TokenOtpController } from '../token-otp.controller';
import { ITokenOtpService, TOKEN_OTP_SERVICE } from '../../../domain/ports/input/token-otp-service.interface';
import { CreateOtpDto } from '../../model/create-token-otp.dto';
import { TokenOtp } from '../../../domain/model/token-otp';
import { ValidateOtpDto } from '../../model/validate-token-otp.dto';
import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('TokenOtpController', () => {
  let controller: TokenOtpController;

  const mockTokenOtpService: ITokenOtpService = {
    create: jest.fn(),
    validate: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenOtpController],
      providers: [
        {
          provide: TOKEN_OTP_SERVICE,
          useValue: mockTokenOtpService
        }
      ],
    }).compile();

    controller = module.get<TokenOtpController>(TokenOtpController);
  });

  describe('create', () => {
    it('deve criar um token OTP e retornar a resposta formatada', async () => {

      const createOtpDto: CreateOtpDto = {
        userId: '123',
        expirationMinutes: 5
      };

      const mockToken = '123456';
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const mockTokenOtp = new TokenOtp({
        token: mockToken,
        tokenHashed: `hashed_${mockToken}`,
        expiresAt,
        userId: createOtpDto.userId
      });

      (mockTokenOtpService.create as jest.Mock).mockResolvedValue(mockTokenOtp);

      const result = await controller.create(createOtpDto);

      expect(mockTokenOtpService.create).toHaveBeenCalledWith(
        createOtpDto.userId,
        createOtpDto.expirationMinutes
      );

      expect(result).toEqual({
        token: mockToken,
        expiresAt: expiresAt
      });
    });
  });

  describe('validate', () => {
    const validateOtpDto: ValidateOtpDto = {
      userId: '123',
      token: '123456'
    };

    it('deve retornar DTO de sucesso quando o token for válido', async () => {
      const validationResult = {
        isValid: true,
        userId: validateOtpDto.userId,
        message: 'Token válido'
      };

      (mockTokenOtpService.validate as jest.Mock).mockResolvedValue(validationResult);

      const result = await controller.validate(validateOtpDto);

      expect(mockTokenOtpService.validate).toHaveBeenCalledWith(
        validateOtpDto.token,
        validateOtpDto.userId
      );

      expect(result).toEqual(expect.objectContaining({
        isValid: true,
        userId: validateOtpDto.userId,
        message: 'Token válido'
      }));
    });

    it('deve lançar NotFoundException quando o token não for encontrado', async () => {
      const validationResult = {
        isValid: false,
        message: 'Token não encontrado'
      };
      (mockTokenOtpService.validate as jest.Mock).mockResolvedValue(validationResult);

      await expect(controller.validate(validateOtpDto)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar UnauthorizedException quando o token for inválido ou expirado', async () => {
      const validationResult = {
        isValid: false,
        message: 'Token expirado'
      };
      (mockTokenOtpService.validate as jest.Mock).mockResolvedValue(validationResult);

      await expect(controller.validate(validateOtpDto)).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar InternalServerErrorException em erro inesperado', async () => {
      (mockTokenOtpService.validate as jest.Mock).mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.validate(validateOtpDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});