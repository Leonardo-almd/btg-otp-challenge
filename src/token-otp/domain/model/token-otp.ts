import { TokenHashingPort } from "../ports/output/token-hashing.port";

export class TokenOtp {
  private readonly id?: string;
  private readonly token: string;
  private readonly tokenHashed: string;
  private readonly expiresAt: Date;
  private readonly isValid: boolean;
  private readonly userId: string;

  constructor(props: {
    id?: string;
    token: string;
    expiresAt: Date;
    isValid?: boolean;
    tokenHashed: string;
    userId: string;
  }) {
    this.id = props.id;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.isValid = props.isValid ?? true;
    this.tokenHashed = props.tokenHashed;
    this.userId = props.userId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getToken(): string {
    return this.token;
  }

  public getTokenHashed(): string {
    return this.tokenHashed;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public isTokenValid(): boolean {
    return this.isValid && new Date() < this.expiresAt;
  }

  public static create(
    hashingService: TokenHashingPort,
    userId: string,
    expirationMinutes?: number): TokenOtp {
    const token = this.generateToken();
    const expiresAt = this.calculateExpirationTime(expirationMinutes);
    const tokenHashed = hashingService.hashToken(token);
    return new TokenOtp({
      token,
      expiresAt,
      tokenHashed,
      userId
    });
  }

  private static generateToken(): string {
    // Gera um token numérico de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private static calculateExpirationTime(expirationMinutes: number = 1): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
    return expiresAt;
  }

  public invalidate(): TokenOtp {
    return new TokenOtp({
      id: this.id,
      token: this.token,
      tokenHashed: this.tokenHashed,
      expiresAt: this.expiresAt,
      isValid: false,
      userId: this.userId
    });
  }
}
