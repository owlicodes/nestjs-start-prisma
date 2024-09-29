import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dtos/login-user.dto";
import { UserPayload } from "src/shared/types";

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = "24h";
  private readonly REFRESH_TOKEN_EXPIRES_IN = "7d";

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    await this.usersService.createUser(data);

    return {
      message: "User registered.",
    };
  }

  async login(data: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(data.email);
    if (!user) throw new BadRequestException("User does not exists.");

    const passwordsMatched = await compare(data.password, user.password);
    if (!passwordsMatched)
      throw new BadRequestException("Invalid credentials.");

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(data: UserPayload) {
    const payload = { sub: data.user.sub, email: data.user.email };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
    };
  }
}
