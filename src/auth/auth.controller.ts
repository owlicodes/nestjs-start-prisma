import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { RefreshGuard } from "./guards/refresh.guard";
import { UserPayload } from "src/shared/types";

@ApiTags("auth")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Registers a new user." })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully registered.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request exception like user already exists.",
  })
  register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post("login")
  @ApiOperation({ summary: "Logs in an existing user." })
  @ApiResponse({
    status: 201,
    description: "The user has been logged in and tokens have been created.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad request exception like user does not exists or invalid credentials.",
  })
  login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @UseGuards(RefreshGuard)
  @Post("refresh")
  @ApiBearerAuth("jwt-auth")
  @ApiOperation({
    summary: "Refreshes the access token for the logged in user.",
  })
  @ApiResponse({
    status: 201,
    description: "A new access token is created.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request exception like invalid refresh token.",
  })
  refresh(@Request() req: UserPayload) {
    return this.authService.refresh(req);
  }
}
