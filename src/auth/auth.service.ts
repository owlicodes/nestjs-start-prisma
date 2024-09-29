import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dtos/login-user.dto";

@Injectable()
export class AuthService {
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
      expiresIn: "24h",
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
