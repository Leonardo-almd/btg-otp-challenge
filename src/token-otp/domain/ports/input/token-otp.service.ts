import { TokenOtp } from "../../model/token-otp";
import { ITokenOtpService, ITokenOtpValidationResult } from "./token-otp-service.interface";
import { ITokenOtpRepository, TOKEN_OTP_REPOSITORY } from "../output/token-otp-repository.interface";
import { Inject, Logger } from "@nestjs/common";
import { TOKEN_HASHING_PORT, TokenHashingPort } from "../output/token-hashing.port";

export class TokenOtpService implements ITokenOtpService {
  private readonly logger = new Logger(TokenOtpService.name);
  
  constructor(
    @Inject(TOKEN_OTP_REPOSITORY)
    private readonly tokenOtpRepository: ITokenOtpRepository,
    @Inject(TOKEN_HASHING_PORT)
    private readonly tokenHashingService: TokenHashingPort
  ) { }

  async create(userId: string, expirationMinutes?: number): Promise<TokenOtp> {
    const tokenOtp = TokenOtp.create(this.tokenHashingService, userId, expirationMinutes);
    return await this.tokenOtpRepository.create(tokenOtp);
  }

  async validate(token: string, userId: string): Promise<ITokenOtpValidationResult> {
    try {
      let tokenOtp: TokenOtp | null = null;

      tokenOtp = await this.tokenOtpRepository.findByUserId(userId);

      if (!tokenOtp) {
        return {
          isValid: false,
          message: 'Token não encontrado ou inválido.'
        };
      }
      
      const validationResult = tokenOtp.validateToken(this.tokenHashingService, token);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      tokenOtp.invalidate();
      await this.tokenOtpRepository.delete(tokenOtp.getUserId());
      
      return {
        isValid: true,
        userId: tokenOtp.getUserId(),
        message: 'Token válido.'
      };
      
    } catch (error) {
      this.logger.error(`Erro ao validar token: ${error.message}`, error.stack);
      return {
        isValid: false,
        message: 'Erro ao validar o token.'
      };
    }
  }
}
