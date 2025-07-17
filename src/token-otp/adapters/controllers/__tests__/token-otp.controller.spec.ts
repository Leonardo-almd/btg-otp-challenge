import { Test, TestingModule } from '@nestjs/testing';
import { TokenOtpController } from '../token-otp.controller';
import { ITokenOtpService, TOKEN_OTP_SERVICE } from '../../../domain/ports/input/token-otp-service.interface';
import { CreateOtpDto } from '../../model/create-token-otp.dto';
import { TokenOtp } from '../../../domain/model/token-otp';

describe('TokenOtpController', () => {
  let controller: TokenOtpController;
  
  const mockTokenOtpService: ITokenOtpService = {
    create: jest.fn()
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
});