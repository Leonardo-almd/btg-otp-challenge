import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { CreateOtpUseCase } from '../../application/use-cases/create-otp.use-case';

describe('OtpController', () => {
  let controller: OtpController;
  let createOtpUseCase: CreateOtpUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        {
          provide: CreateOtpUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OtpController>(OtpController);
    createOtpUseCase = module.get<CreateOtpUseCase>(CreateOtpUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOtp', () => {
    it('should call createOtpUseCase.execute with correct parameters', async () => {
      // Arrange
      const createOtpDto = { userId: '123' };
      const expectedResponse = {
        token: '123456',
        expiresAt: new Date(),
      };
      jest.spyOn(createOtpUseCase, 'execute').mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createOtp(createOtpDto);

      // Assert
      expect(createOtpUseCase.execute).toHaveBeenCalledWith(createOtpDto);
      expect(result).toEqual(expectedResponse);
    });
  });
}); 