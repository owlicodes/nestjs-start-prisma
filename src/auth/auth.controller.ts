import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";

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
}
