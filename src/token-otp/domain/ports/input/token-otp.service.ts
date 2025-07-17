import { TokenOtp } from "../../model/token-otp";
import { ITokenOtpService } from "./token-otp-service.interface";
import { ITokenOtpRepository, TOKEN_OTP_REPOSITORY } from "../output/token-otp-repository.interface";
import { Inject } from "@nestjs/common";
import { TOKEN_HASHING_PORT, TokenHashingPort } from "../output/token-hashing.port";

export class TokenOtpService implements ITokenOtpService {
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
}
