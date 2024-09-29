# nestjs-start-prisma

This is a starter repository for creating backend api services using NestJS and Prisma. The default database used for this repository is Postgesql and the default authentication method is JWT.

These defaults can easily be replaced with your preferred database like MongoDB or using Sessions for authentication. Just remove or modify the packages or codes related to Postgres and JWT.

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
DATABASE_URL="postgresql://admin:password@localhost:5432/nest-db?schema=public"
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
