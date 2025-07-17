import { TokenOtp } from '../../model/token-otp';

export const TOKEN_OTP_REPOSITORY = 'TOKEN_OTP_REPOSITORY';

export interface ITokenOtpRepository {
  create(tokenOtp: TokenOtp): Promise<TokenOtp>;
  findByUserId(userId: string): Promise<TokenOtp | null>;
  delete(userId: string): Promise<void>;
}
