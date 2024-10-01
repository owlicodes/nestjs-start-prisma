import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "../prisma/prisma.service";
import { UsersRepository } from "./users.repository";
import { AppConfigModule } from "../config/config.module";

@Module({
  imports: [AppConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
