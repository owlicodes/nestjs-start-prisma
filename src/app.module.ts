import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { EnvironmentVariables, envSchema } from "./config/config";
import { AppConfigModule } from "./config/config.module";
import { AppConfigService } from "./config/config.service";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => [
        {
          ttl: appConfigService.getRateLimitTtl(),
          limit: appConfigService.getRateLimit(),
        },
      ],
    }),
    ConfigModule.forRoot({
      validate: (config: Record<string, unknown>) => {
        const result = envSchema.safeParse(config);

        if (!result.success) {
          throw new Error(
            `Config validation error: ${result.error.toString()}`,
          );
        }

        return result.data as EnvironmentVariables;
      },
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
