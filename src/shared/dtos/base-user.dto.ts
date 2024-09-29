import { IsEmail, MaxLength, MinLength } from "class-validator";

export class BaseUserDto {
  @IsEmail(
    {},
    {
      message: "Not a valid email.",
    },
  )
  @MaxLength(200, {
    message: "Email must not be more than 200 characters.",
  })
  email: string;

  @MinLength(8, {
    message: "Password must be atleast 8 characters.",
  })
  password: string;
}
