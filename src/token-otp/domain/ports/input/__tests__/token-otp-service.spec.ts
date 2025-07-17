import { TokenOtp } from '../../../model/token-otp';
import { TokenOtpService } from '../token-otp.service';
import { ITokenOtpRepository } from '../../output/token-otp-repository.interface';
import { TokenHashingPort } from '../../output/token-hashing.port';

describe('TokenOtpService', () => {

  const mockTokenHashingService: TokenHashingPort = {
    hashToken: jest.fn().mockImplementation((token) => `hashed_${token}`),
    verifyToken: jest.fn()
  };

  const mockTokenOtpRepository: ITokenOtpRepository = {
    create: jest.fn().mockImplementation((tokenOtp) => Promise.resolve(tokenOtp))
  };

  let tokenOtpService: TokenOtpService;

  beforeEach(() => {
    jest.clearAllMocks();
    tokenOtpService = new TokenOtpService(mockTokenOtpRepository, mockTokenHashingService);
  });

  describe('create', () => {
    it('deve criar um token OTP e salvá-lo no repositório', async () => {

      const userId = '123';
      const expirationMinutes = 5;

      const createSpy = jest.spyOn(TokenOtp, 'create');

      const result = await tokenOtpService.create(userId, expirationMinutes);

      expect(createSpy).toHaveBeenCalledWith(mockTokenHashingService, userId, expirationMinutes);
      expect(mockTokenOtpRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.getUserId()).toBe(userId);
    });

    it('deve usar o tempo de expiração padrão (1 minuto) quando não especificado', async () => {

      const userId = '123';

      const createSpy = jest.spyOn(TokenOtp, 'create');

      await tokenOtpService.create(userId);

      expect(createSpy).toHaveBeenCalledWith(mockTokenHashingService, userId, undefined);
    });
  });
});