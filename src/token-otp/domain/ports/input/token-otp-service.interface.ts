import { TokenOtp } from "../../model/token-otp";

export const TOKEN_OTP_SERVICE = 'TOKEN_OTP_SERVICE';

export interface ITokenOtpValidationResult {
  isValid: boolean;
  userId?: string;
  message: string;
}

export interface ITokenOtpService {
  create(userId: string, expirationMinutes?: number): Promise<TokenOtp>;
  validate(token: string, userId: string): Promise<ITokenOtpValidationResult>;
}
