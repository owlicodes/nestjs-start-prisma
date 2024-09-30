import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser = { email: "test@email.com", password: "testPassword" };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should return 'User registered.'", async () => {
      jest
        .spyOn(authService, "register")
        .mockResolvedValue({ message: "User registered." });

      const response = await authController.register(mockUser);
      expect(response).toEqual({ message: "User registered." });
    });

    it("should throw a BadRequestException", async () => {
      jest
        .spyOn(authService, "register")
        .mockRejectedValue(new BadRequestException());

      await expect(authController.register(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("login", () => {
    it("shold return the accessToken and the refreshToken", async () => {
      const mockResponse = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };

      jest.spyOn(authService, "login").mockResolvedValue(mockResponse);

      const response = await authController.login(mockUser);

      expect(response).toEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it("should throw a BadRequestException", async () => {
      jest
        .spyOn(authService, "login")
        .mockRejectedValue(new BadRequestException());

      await expect(authController.login(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("refresh", () => {
    it("should return a new access token.", async () => {
      const mockResponse = {
        accessToken: "newAccessToken",
      };
      const mockUserPayload = { user: { sub: 0, email: "test@email.com" } };

      jest.spyOn(authService, "refresh").mockResolvedValue(mockResponse);

      const response = await authController.refresh(mockUserPayload);

      expect(response).toEqual(mockResponse);
      expect(authService.refresh).toHaveBeenCalledWith(mockUserPayload);
    });
  });
});
