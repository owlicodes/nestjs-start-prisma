import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UserPayload } from "src/shared/types";

@ApiTags("users")
@Controller({
  path: "users",
  version: "1",
})
@UseGuards(AuthGuard)
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiBearerAuth("jwt-auth")
  @ApiOperation({ summary: "Gets the logged in user information." })
  @ApiResponse({
    status: 200,
    description: "User information has been fetched.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized, a valid token is missing or expired.",
  })
  getLoggedInUser(@Request() req: UserPayload) {
    return this.usersService.getUserByEmail(req.user.email);
  }
}
