import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { AppConfigService } from "../config/config.service";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = { email: "test@email.com", password: "testPassword" };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AppConfigService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    it("should return 'User registered.'.", async () => {
      const createUserResolvedMessage = { message: "User created." };
      const registerResolvedMessage = { message: "User registered." };

      jest
        .spyOn(usersService, "createUser")
        .mockResolvedValue(createUserResolvedMessage);

      const result = await authService.register(mockUser);
      expect(result).toEqual(registerResolvedMessage);
      expect(usersService.createUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("login", () => {
    it("should call the jwtService sign method twice, 1 for access token and 1 for refresh token.", async () => {
      jest.spyOn(usersService, "getUserByEmail").mockResolvedValue({
        ...mockUser,
        id: 0,
        createdAt: new Date(),
        password: "testpassword",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
