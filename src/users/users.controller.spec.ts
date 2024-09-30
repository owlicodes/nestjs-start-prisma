import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const userPayload = {
    user: {
      sub: 0,
      email: "test@email.com",
    },
  };
  const mockUser = {
    id: 0,
    email: "test@email.com",
    password: "testPassword",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        JwtService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe("getUserByEmail", () => {
    it("should return the user.", async () => {
      jest.spyOn(usersService, "getUserByEmail").mockResolvedValue(mockUser);

      const response = await usersController.getLoggedInUser(userPayload);

      expect(response.email).toEqual(mockUser.email);
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it("should return the null.", async () => {
      jest.spyOn(usersService, "getUserByEmail").mockResolvedValue(null);

      const response = await usersController.getLoggedInUser(userPayload);

      expect(response).toBeNull();
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });
});
