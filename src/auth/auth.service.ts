import { Injectable } from "@nestjs/common";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: RegisterUserDto) {
    await this.usersService.createUser(data);

    return {
      message: "User registered.",
    };
  }
}
