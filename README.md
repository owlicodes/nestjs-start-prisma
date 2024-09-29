# nestjs-start-prisma

![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgresQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

This is a starter repository for creating backend api services using NestJS and Prisma. The default database used for this repository is Postgesql and the default authentication method is JWT.

These defaults can easily be replaced with your preferred database like MongoDB or using Sessions for authentication. Just remove or modify the packages or codes related to Postgres and JWT.

## Table of Contents

1. [Default Docker Compose](#default-docker-compose)
2. [Environment Variables](#environment-variables)
3. [Initiate Prisma](#initiate-prisma)
4. [API Routes](#api-routes)
5. [Rate Limiting](#rate-limiting)
6. [Swagger Documentation](#swagger-documentation)
7. [Postman Collection](#postman-collection)

## Default Docker Compose

The repository also contains a default docker-compose.yml file which will spin up a postgresql database and a pgadmin. You can replace this docker-compose.yml file with a different database image if you are going to use one.

To run the docker-compose.yml file, run the command below while on the root folder. This assumes that you have docker in your machine.

```bash
docker-compose up . -d
```

## Environment Variables

Below is an example of what your .env file should contain. The environment variables are validated using Zod. If you want to add a new environment variable, make sure you also add the getter method in the AppConfigService to make the application consistent.

```.env
PORT=5000
DATABASE_URL="postgresql://admin:admin@localhost:5432/nest-db?schema=public"
JWT_ACCESS_SECRET="jwtAccessSecret"
JWT_ACCESS_EXPIRY="24h"
JWT_REFRESH_SECRET="jwtRefreshSecret"
JWT_REFRESH_EXPIRY="7d"
RATE_LIMIT_TTL=3600
RATE_LIMIT=100
```

Below is the equivalent zod object schema defined in config.ts.

```typescript
export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRY: z.string(),
  RATE_LIMIT_TTL: z.coerce.number(),
  RATE_LIMIT: z.coerce.number(),
});
```

## Initiate Prisma

The schema.prisma has a default model of User which contains basic properties which you can modify to your needs.

To generate the prisma models, run the command below.

```bash
npx prisma generate
```

To apply the models to your postgresql database, run the command below.

```bash
npx prisma migrate dev
```

After running the migrate dev command, just enter the migrate name, since it is the first time you are going to migrate your prisma models, it is typically named "init". Once the migrate command is successful, you should see the "User" table created in your postgresql database.

The repository also contains a seed.ts script that will insert a default user. You can run this command if you want to, or you can just ignore it.

To run the seed script, run the command below.

```bash
npx prisma db seed
```

## API Routes

| URL            | Description                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /auth/register | Register a new user by creating the record in the database.                                                                                                                |
| /auth/login    | Logs in the user by returning an access token and a refresh token. By default, the access token will expire after 24 hours and the refresh token will expire after 1 week. |
| /auth/refresh  | Creates a new access token to replace an expired token using the validity of the refresh token.                                                                            |
| /users/me      | Gets the logged in user information using the access token.                                                                                                                |

## Rate Limiting

By default, a rate limiter is implemented in this project using @nestjs/throttler, it is best practice to implement rate limiter early on to avoid DOS attacks or BOT attacks. You can set the Time To Live and the Rate Limit generously in the .env file.

The rate limiting strategy implemented here is a basic Fixed Window implementation. You can easily implement a different strategy like Token Bucket if you want to using [rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible) with a combination of [redis](https://redis.io/).

## Swagger Documentation

The repository includes the openapi swagger documentation for all the available routes, this can be a good starting point for adding more documentation whenever a new route is added. To start the swagger documenation, just run the project normally and then open http://localhost:5000/docs

![Swagger Documentation](./public/swagger.png)

## Postman Collection

A postman data file has also been added to the project, which can be used to quickly generate the postman environment and collections by just simply importing it to your postman application. Unzip the postman-data.zip to get the postman data.

![Postman Collection](./public/postman.png)
