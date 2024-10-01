import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dtos/login-user.dto";
import { UserPayload } from "../shared/types";
import { AppConfigService } from "../config/config.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  private async generateTokens(payload) {
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

  async register(data: RegisterUserDto) {
    const response = await this.usersService.createUser(data);

    const payload = { sub: response.user.id, email: response.user.email };
    const tokens = await this.generateTokens(payload);

    return {
      user: response.user,
      tokens,
    };
  }

  async login(data: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(data.email, true);
    if (!user) throw new BadRequestException("User does not exists.");

    const passwordsMatched = await compare(data.password, user.password);
    if (!passwordsMatched)
      throw new BadRequestException("Invalid credentials.");

    const payload = { sub: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);

    delete user.password;

    return {
      user,
      tokens,
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
