export class OtpEntity {
  constructor(
    private readonly token: string,
    private readonly expiresAt: Date,
    private readonly userId: string,
    private readonly isValid: boolean = true,
  ) {}

  getToken(): string {
    return this.token;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getUserId(): string {
    return this.userId;
  }

  isValidToken(): boolean {
    return this.isValid && new Date() < this.expiresAt;
  }

  invalidate(): OtpEntity {
    return new OtpEntity(
      this.token,
      this.expiresAt,
      this.userId,
      false,
    );
  }
} 