import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { AppConfigModule } from "src/config/config.module";

@Module({
  imports: [AppConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
