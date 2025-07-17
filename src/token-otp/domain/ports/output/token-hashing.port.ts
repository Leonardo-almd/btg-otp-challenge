export interface TokenHashingPort {
  hashToken(token: string): string;
  verifyToken(token: string, hash: string): boolean;
}

export const TOKEN_HASHING_PORT = 'TOKEN_HASHING_PORT';