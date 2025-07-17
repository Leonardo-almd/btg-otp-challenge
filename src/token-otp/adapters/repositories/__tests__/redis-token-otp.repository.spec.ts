import { Test, TestingModule } from '@nestjs/testing';
import { RedisTokenOtpRepository } from '../redis-token-otp.repository';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { TokenOtp } from '../../../domain/model/token-otp';

describe('RedisTokenOtpRepository', () => {
  let repository: RedisTokenOtpRepository;
  
  const mockRedisClient = {
    set: jest.fn().mockImplementation(() => Promise.resolve('OK')),
    get: jest.fn(),
    del: jest.fn()
  };
  
  const mockRedisService = {
    getClient: jest.fn().mockReturnValue(mockRedisClient)
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisTokenOtpRepository,
        {
          provide: RedisService,
          useValue: mockRedisService
        }
      ],
    }).compile();

    repository = module.get<RedisTokenOtpRepository>(RedisTokenOtpRepository);
  });

  describe('create', () => {
    it('deve salvar o token OTP no Redis com TTL correto', async () => {
      
      const userId = '123';
      const token = '123456';
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      const tokenOtp = new TokenOtp({
        token,
        tokenHashed: `hashed_${token}`,
        expiresAt,
        userId
      });
      
      const result = await repository.create(tokenOtp);
      
      expect(result).toBe(tokenOtp);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `user:${userId}`,
        expect.any(String),
        expect.objectContaining({ EX: expect.any(Number) })
      );
      
      const storedData = JSON.parse(mockRedisClient.set.mock.calls[0][1]);
      expect(storedData).toEqual({
        token: `hashed_${token}`,
        userId,
        expiresAt: expiresAt.toISOString(),
        isValid: true
      });
      
      const ttl = mockRedisClient.set.mock.calls[0][2].EX;
      expect(ttl).toBeGreaterThan(290);
      expect(ttl).toBeLessThanOrEqual(300);
    });
  });
});