import { TokenOtp } from "../../model/token-otp";

export const TOKEN_OTP_SERVICE = 'TOKEN_OTP_SERVICE';

export interface ITokenOtpService {
  create(userId: string, expirationMinutes?: number): Promise<TokenOtp>;
}
