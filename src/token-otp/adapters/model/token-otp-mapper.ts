import { TokenOtp } from '../../domain/model/token-otp';
import { TokenOtpResponseDto } from './token-otp-response.dto';

export class TokenOtpMapper {
  static toResponseDto(otp: TokenOtp): TokenOtpResponseDto {
    return new TokenOtpResponseDto(
      otp.getToken(),
      otp.getExpiresAt()
    );
  }
} 