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
    create: jest.fn().mockImplementation((tokenOtp) => Promise.resolve(tokenOtp)),
    findByUserId: jest.fn(),
    delete: jest.fn().mockImplementation((userId) => Promise.resolve())
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

  describe('validate', () => {
    it('deve validar um token OTP correto e marcá-lo como usado', async () => {
      const userId = '123';
      const token = '123456';
      const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutos no futuro
      
      const mockTokenOtp = new TokenOtp({
        token: '',
        tokenHashed: `hashed_${token}`,
        userId,
        expiresAt,
        isValid: true
      });
      
      const validateTokenSpy = jest.spyOn(mockTokenOtp, 'validateToken').mockReturnValue({ isValid: true, message: 'Token válido.' });
      const invalidateSpy = jest.spyOn(mockTokenOtp, 'invalidate');
      
      (mockTokenOtpRepository.findByUserId as jest.Mock).mockResolvedValue(mockTokenOtp);

      const result = await tokenOtpService.validate(token, userId);

      expect(mockTokenOtpRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(validateTokenSpy).toHaveBeenCalledWith(mockTokenHashingService, token);
      expect(invalidateSpy).toHaveBeenCalled();
      expect(mockTokenOtpRepository.delete).toHaveBeenCalled();
      
      expect(result).toEqual({
        isValid: true,
        userId,
        message: expect.any(String)
      });
    });

    it('deve retornar isValid=false quando o token não existe para o usuário', async () => {
      const userId = '123';
      const token = '123456';
      
      (mockTokenOtpRepository.findByUserId as jest.Mock).mockResolvedValue(null);

      const result = await tokenOtpService.validate(token, userId);

      expect(mockTokenOtpRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockTokenOtpRepository.delete).not.toHaveBeenCalled();
      
      expect(result).toEqual({
        isValid: false,
        message: expect.stringContaining('não encontrado')
      });
    });

    it('deve retornar isValid=false quando o token é inválido', async () => {
      const userId = '123';
      const token = '123456';
      const wrongToken = '654321';
      const expiresAt = new Date(Date.now() + 5 * 60000);
      
      const mockTokenOtp = new TokenOtp({
        token: '',
        tokenHashed: `hashed_${token}`, // Vai falhar ao validar com wrongToken
        userId,
        expiresAt,
        isValid: true
      });
      
      const validateTokenSpy = jest.spyOn(mockTokenOtp, 'validateToken').mockReturnValue({ isValid: false, message: 'Token inválido.' });
      (mockTokenOtpRepository.findByUserId as jest.Mock).mockResolvedValue(mockTokenOtp);

      const result = await tokenOtpService.validate(wrongToken, userId);

      expect(mockTokenOtpRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(validateTokenSpy).toHaveBeenCalledWith(mockTokenHashingService, wrongToken);
      expect(mockTokenOtpRepository.delete).not.toHaveBeenCalled();
      
      expect(result).toEqual({
        isValid: false,
        message: expect.stringContaining('inválido')
      });
    });

    it('deve retornar isValid=false quando o token está expirado', async () => {
      const userId = '123';
      const token = '123456';
      const expiresAt = new Date(Date.now() - 5 * 60000); // 5 minutos no passado (expirado)
      
      const mockTokenOtp = new TokenOtp({
        token: '',
        tokenHashed: `hashed_${token}`,
        userId,
        expiresAt,
        isValid: true
      });
      
      jest.spyOn(mockTokenOtp, 'validateToken').mockReturnValue({ isValid: false, message: 'Token inválido.' });
      (mockTokenOtpRepository.findByUserId as jest.Mock).mockResolvedValue(mockTokenOtp);

      const result = await tokenOtpService.validate(token, userId);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('inválido');
    });

    
  });
});