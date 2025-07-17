import { Test, TestingModule } from '@nestjs/testing';
import { CryptoHashingService } from '../crypto-hashing.service';

describe('CryptoHashingService', () => {
  let service: CryptoHashingService;
  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = { ...originalEnv };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoHashingService],
    }).compile();

    service = module.get<CryptoHashingService>(CryptoHashingService);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('hashToken', () => {
    it('deve gerar um hash usando o salt padrão quando não configurado', () => {
      delete process.env.TOKEN_HASH_SALT;
      const token = '123456';
      
      const hash1 = service.hashToken(token);
      const hash2 = service.hashToken(token);
      
      expect(hash1).toBeDefined();
      expect(hash1).toBe(hash2); 
    });

    it('deve gerar um hash usando o salt configurado', () => {
      process.env.TOKEN_HASH_SALT = 'test-salt';
      const token = '123456';
      
      const hash = service.hashToken(token);
      
      expect(hash).toBeDefined();
    });

    it('deve gerar hashes diferentes para tokens diferentes', () => {
      const token1 = '123456';
      const token2 = '654321';
      
      const hash1 = service.hashToken(token1);
      const hash2 = service.hashToken(token2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyToken', () => {
    it('deve retornar true quando o token corresponde ao hash', () => {     
      const token = '123456';
      const hash = service.hashToken(token);
      
      const result = service.verifyToken(token, hash);
      
      expect(result).toBe(true);
    });

    it('deve retornar false quando o token não corresponde ao hash', () => {
      const token = '123456';
      const wrongToken = '654321';
      const hash = service.hashToken(token);
      
      const result = service.verifyToken(wrongToken, hash);
      
      expect(result).toBe(false);
    });

    it('deve retornar false quando o hash tem formato inválido', () => {
      const token = '123456';
      const invalidHash = 'invalid-hash';
      
      const result = service.verifyToken(token, invalidHash);
      
      expect(result).toBe(false);
    });
  });
});