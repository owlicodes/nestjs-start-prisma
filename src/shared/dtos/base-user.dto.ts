import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class BaseUserDto {
  @ApiProperty()
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

  @ApiProperty()
  @MinLength(8, {
    message: "Password must be atleast 8 characters.",
  })
  password: string;
}
