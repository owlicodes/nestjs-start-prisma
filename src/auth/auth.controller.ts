import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { RefreshGuard } from "./guards/refresh.guard";
import { UserPayload } from "src/shared/types";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post("login")
  login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @UseGuards(RefreshGuard)
  @Post("refresh")
  refresh(@Request() req: UserPayload) {
    return this.authService.refresh(req);
  }
}
