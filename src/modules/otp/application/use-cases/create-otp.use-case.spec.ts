import { Test, TestingModule } from '@nestjs/testing';
import { CreateOtpUseCase } from './create-otp.use-case';
import { OtpGeneratorService } from '../../domain/services/otp-generator.service';
import { OTP_REPOSITORY_TOKEN, OtpRepositoryPort } from '../ports/otp-repository.port';
import { OtpEntity } from '../../domain/entities/otp.entity';

describe('CreateOtpUseCase', () => {
  let useCase: CreateOtpUseCase;
  let otpGeneratorService: OtpGeneratorService;
  let otpRepository: OtpRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOtpUseCase,
        {
          provide: OtpGeneratorService,
          useValue: {
            generateOtp: jest.fn(),
          },
        },
        {
          provide: OTP_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateOtpUseCase>(CreateOtpUseCase);
    otpGeneratorService = module.get<OtpGeneratorService>(OtpGeneratorService);
    otpRepository = module.get<OtpRepositoryPort>(OTP_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create and save a new OTP', async () => {
      // Arrange
      const userId = '123';
      const token = '123456';
      const expiresAt = new Date();
      const otpEntity = new OtpEntity(token, expiresAt, userId);

      jest.spyOn(otpGeneratorService, 'generateOtp').mockReturnValue(otpEntity);
      jest.spyOn(otpRepository, 'save').mockResolvedValue(otpEntity);

      // Act
      const result = await useCase.execute({ userId });

      // Assert
      expect(otpGeneratorService.generateOtp).toHaveBeenCalledWith(userId);
      expect(otpRepository.save).toHaveBeenCalledWith(otpEntity);
      expect(result).toEqual({
        token,
        expiresAt,
      });
    });
  });
}); 