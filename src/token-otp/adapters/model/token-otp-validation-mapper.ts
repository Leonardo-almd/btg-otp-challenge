import { TokenOtpValidationResponseDto } from './token-otp-validation-response.dto';
import { ITokenOtpValidationResult } from '../../domain/ports/input/token-otp-service.interface';

export class TokenOtpValidationMapper {
  static toResponseDto(validationResult: ITokenOtpValidationResult): TokenOtpValidationResponseDto {
    return new TokenOtpValidationResponseDto(
      validationResult.isValid,
      validationResult.message,
      validationResult.userId
    );
  }
}