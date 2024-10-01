import { Test, TestingModule } from "@nestjs/testing";

import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { BadRequestException } from "@nestjs/common";

describe("UsersService", () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  const mockUser = {
    id: 0,
    email: "test@email.com",
    password: "testPassword",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe("createUser", () => {
    it("should return 'User created.'", async () => {
      const createUserData = {
        email: mockUser.email,
        password: mockUser.password,
      };

      jest.spyOn(usersRepository, "getUserByEmail").mockResolvedValue(null);
      jest.spyOn(usersRepository, "createUser").mockResolvedValue(mockUser);

      const response = await usersService.createUser(createUserData);

      expect(response.message).toEqual("User created.");
      expect(response.user.email).toEqual(mockUser.email);
      expect(usersRepository.createUser).toHaveBeenCalled();
    });

    it("should throw a BadRequestException", async () => {
      jest.spyOn(usersRepository, "getUserByEmail").mockResolvedValue(mockUser);

      await expect(
        usersService.createUser({
          email: mockUser.email,
          password: mockUser.password,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getUserByEmail", () => {
    it("should return the user data.", async () => {
      jest.spyOn(usersRepository, "getUserByEmail").mockResolvedValue(mockUser);

      const response = await usersService.getUserByEmail(mockUser.email);

      expect(response.email).toEqual(mockUser.email);
      expect(response.password).toBeUndefined();
      expect(usersRepository.getUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
    });

    it("should return null.", async () => {
      jest.spyOn(usersRepository, "getUserByEmail").mockResolvedValue(null);

      const response = await usersService.getUserByEmail(mockUser.email);

      expect(response).toBeNull();
      expect(usersRepository.getUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
    });
  });
});
