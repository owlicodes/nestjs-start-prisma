import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { AppConfigService } from "../config/config.service";
import { BadRequestException } from "@nestjs/common";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = { email: "test@email.com", password: "testPassword" };
  const mockResolvedUser = {
    ...mockUser,
    id: 0,
    createdAt: new Date(),
    password: "testpassword",
  };
  const payloadData = { user: { sub: 0, email: "test@email.com" } };

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
      jest.spyOn(usersService, "createUser").mockResolvedValue({
        user: {
          ...mockUser,
          id: 0,
          createdAt: new Date(),
        },
        message: "User created.",
      });

      await authService.register(mockUser);

      expect(usersService.createUser).toHaveBeenCalled();
      expect(usersService.createUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("login", () => {
    it("should call the jwtService sign method twice, 1 for access token and 1 for refresh token.", async () => {
      jest
        .spyOn(usersService, "getUserByEmail")
        .mockResolvedValue(mockResolvedUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it("should throw a BadRequestException if the user already exists.", async () => {
      jest.spyOn(usersService, "getUserByEmail").mockResolvedValue(null);

      await expect(authService.login(mockUser)).rejects.toThrow(
        BadRequestException,
      );

      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException if passwords do not match", async () => {
      jest
        .spyOn(usersService, "getUserByEmail")
        .mockResolvedValue(mockResolvedUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(authService.login(mockUser)).rejects.toThrow(
        BadRequestException,
      );

      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("should sign a new token", async () => {
      await authService.refresh(payloadData);

      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
