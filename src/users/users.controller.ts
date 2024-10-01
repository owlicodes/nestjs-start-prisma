import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserPayload } from "../shared/types";
import { AllowNullResponse } from "../shared/decorators/allow-null-response.decorator";

@ApiTags("users")
@Controller({
  path: "users",
  version: "1",
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @AllowNullResponse()
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
  async getLoggedInUser(@Request() req: UserPayload) {
    if (!req.user) {
      return {
        data: null,
      };
    } else {
      const data = await this.usersService.getUserByEmail(req.user.email);

      return {
        data,
      };
    }
  }
}
