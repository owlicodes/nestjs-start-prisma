import { BadRequestException, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";

import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: CreateUserDto) {
    let user = await this.getUserByEmail(data.email);

    if (user) throw new BadRequestException("User already exists.");

    const hashedPassword = await hash(data.password, 10);
    user = await this.usersRepository.createUser({
      email: data.email,
      password: hashedPassword,
    });

    delete user.password;

    return {
      user,
      message: "User created.",
    };
  }

  async getUserByEmail(email: string, includePassword = false) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (user && !includePassword) {
      delete user.password;
    }

    return user;
  }
}
