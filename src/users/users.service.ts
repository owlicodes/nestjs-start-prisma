import { BadRequestException, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";

import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: CreateUserDto) {
    const user = await this.usersRepository.getUserByEmail(data.email);

    if (user) throw new BadRequestException("User already exists.");

    const hashedPassword = await hash(data.password, 10);
    await this.usersRepository.createUser({
      email: data.email,
      password: hashedPassword,
    });

    return {
      message: "User created.",
    };
  }
}
