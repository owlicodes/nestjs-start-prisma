import { Controller, Get, Request, UseGuards } from "@nestjs/common";

import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserPayload } from "src/shared/types";

@Controller({
  path: "users",
  version: "1",
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getLoggedInUser(@Request() req: UserPayload) {
    return this.usersService.getUserByEmail(req.user.email);
  }
}
