import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dtos/login-user.dto";
import { UserPayload } from "src/shared/types";
import { AppConfigService } from "src/config/config.service";

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = "24h";
  private readonly REFRESH_TOKEN_EXPIRES_IN = "7d";

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async register(data: RegisterUserDto) {
    await this.usersService.createUser(data);

    return {
      message: "User registered.",
    };
  }

  async login(data: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(data.email, true);
    if (!user) throw new BadRequestException("User does not exists.");

    const passwordsMatched = await compare(data.password, user.password);
    if (!passwordsMatched)
      throw new BadRequestException("Invalid credentials.");

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.sign(payload, {
      secret: this.appConfigService.getJwtAccessSecret(),
      expiresIn: this.appConfigService.getJwtAccessExpiry(),
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.appConfigService.getJwtRefreshSecret(),
      expiresIn: this.appConfigService.getJwtRefreshExpiry(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(data: UserPayload) {
    const payload = { sub: data.user.sub, email: data.user.email };
    const accessToken = await this.jwtService.sign(payload, {
      secret: this.appConfigService.getJwtAccessSecret(),
      expiresIn: this.appConfigService.getJwtAccessExpiry(),
    });

    return {
      accessToken,
    };
  }
}
