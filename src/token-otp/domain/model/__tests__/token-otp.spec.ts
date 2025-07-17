import { TokenOtp } from '../token-otp';
import { TokenHashingPort } from '../../ports/output/token-hashing.port';

describe('TokenOtp', () => {
  const mockHashingService: TokenHashingPort = {
    hashToken: jest.fn().mockImplementation((token) => `hashed_${token}`),
    verifyToken: jest.fn().mockImplementation((token, hash) => hash === `hashed_${token}`)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um token OTP válido', () => {
      const userId = '123';
      const expirationMinutes = 5;

      const tokenOtp = TokenOtp.create(mockHashingService, userId, expirationMinutes);

      expect(tokenOtp).toBeDefined();
      expect(tokenOtp.getUserId()).toBe(userId);
      expect(tokenOtp.getToken()).toMatch(/^\d{6}$/); // Token de 6 dígitos
      expect(tokenOtp.getTokenHashed()).toBe(`hashed_${tokenOtp.getToken()}`);
      expect(mockHashingService.hashToken).toHaveBeenCalledWith(tokenOtp.getToken());

      // Verifica se a data de expiração está correta (5 minutos no futuro)
      const expectedExpiration = new Date();
      expectedExpiration.setMinutes(expectedExpiration.getMinutes() + expirationMinutes);

      // Permite uma pequena margem de erro (1 segundo) devido ao tempo de execução do teste
      const expiresAt = tokenOtp.getExpiresAt();
      const diffInSeconds = Math.abs((expiresAt.getTime() - expectedExpiration.getTime()) / 1000);
      expect(diffInSeconds).toBeLessThan(1);
    });

    it('deve usar o tempo de expiração padrão (1 minuto) quando não especificado', () => {

      const userId = '123';

      const tokenOtp = TokenOtp.create(mockHashingService, userId);

      const expectedExpiration = new Date();
      expectedExpiration.setMinutes(expectedExpiration.getMinutes() + 1);

      const expiresAt = tokenOtp.getExpiresAt();
      const diffInSeconds = Math.abs((expiresAt.getTime() - expectedExpiration.getTime()) / 1000);
      expect(diffInSeconds).toBeLessThan(1);
    });
  });

  describe('isTokenValid', () => {
    it('deve retornar true para um token válido e não expirado', () => {

      const userId = '123';
      const tokenOtp = TokenOtp.create(mockHashingService, userId, 5);

      expect(tokenOtp.isTokenValid()).toBe(true);
    });

    it('deve retornar false para um token invalidado', () => {

      const userId = '123';
      const tokenOtp = TokenOtp.create(mockHashingService, userId, 5);

      const invalidatedToken = tokenOtp.invalidate();

      expect(invalidatedToken.isTokenValid()).toBe(false);
    });

    it('deve retornar false para um token expirado', () => {

      jest.useFakeTimers();
      const userId = '123';
      const tokenOtp = TokenOtp.create(mockHashingService, userId, 5);

      jest.advanceTimersByTime(6 * 60 * 1000);

      expect(tokenOtp.isTokenValid()).toBe(false);

      jest.useRealTimers();
    });
  });
});