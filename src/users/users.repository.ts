import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(data: Pick<User, "email" | "password">) {
    return this.prismaService.user.create({
      data,
    });
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }
}
