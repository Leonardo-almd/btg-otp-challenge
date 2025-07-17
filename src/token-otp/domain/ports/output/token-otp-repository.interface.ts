import { TokenOtp } from '../../model/token-otp';

export const TOKEN_OTP_REPOSITORY = 'TOKEN_OTP_REPOSITORY';

export interface ITokenOtpRepository {
  create(tokenOtp: TokenOtp): Promise<TokenOtp>;
}
