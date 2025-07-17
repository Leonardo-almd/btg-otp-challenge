import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TokenHashingPort } from '../../domain/ports/output/token-hashing.port';

@Injectable()
export class CryptoHashingService implements TokenHashingPort {

  hashToken(token: string): string {
    const salt = process.env.TOKEN_HASH_SALT || 'default-salt-for-token-hashing';
    return crypto
      .createHmac('sha256', salt)
      .update(token)
      .digest('hex');
  }

  verifyToken(token: string, hash: string): boolean {
    const calculatedHash = this.hashToken(token);
    
    // Comparação de tempo constante para evitar timing attacks
    try {
      return crypto.timingSafeEqual( // "Esconde" informações de tempo de execução da comparação
        Buffer.from(calculatedHash, 'hex'),
        Buffer.from(hash, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}