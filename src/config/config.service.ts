import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EnvironmentVariables } from "./config";

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  getPort(): string {
    return this.configService.get<number>("PORT", { infer: true })!;
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>("DATABASE_URL", { infer: true })!;
  }

  getJwtAccessSecret(): string {
    return this.configService.get<string>("JWT_ACCESS_SECRET", {
      infer: true,
    })!;
  }

  getJwtAccessExpiry(): string {
    return this.configService.get<string>("JWT_ACCESS_EXPIRY", {
      infer: true,
    })!;
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>("JWT_REFRESH_SECRET", {
      infer: true,
    })!;
  }

  getJwtRefreshExpiry(): string {
    return this.configService.get<string>("JWT_REFRESH_EXPIRY", {
      infer: true,
    })!;
  }

  getRateLimitTtl(): number {
    return this.configService.get<number>("RATE_LIMIT_TTL", {
      infer: true,
    })!;
  }

  getRateLimit(): number {
    return this.configService.get<number>("RATE_LIMIT", {
      infer: true,
    })!;
  }
}
