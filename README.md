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

## Default Docker Compose

The repository also contains a default docker-compose.yml file which will spin up a postgresql database and a pgadmin. You can replace this docker-compose.yml file with a different database image if you are going to use one.

To run the docker-compose.yml file, run the command below while on the root folder. This assumes that you have docker in your machine.

```bash
docker-compose up . -d
```

## Environment Variables

Below is an example of what your .env file should contain.

```.env
PORT=5000
DATABASE_URL="postgresql://admin:admin@localhost:5432/nest-db?schema=public"
JWT_ACCESS_SECRET="jwtAccessSecret"
JWT_REFRESH_SECRET="jwtRefreshSecret"
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
