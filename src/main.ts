import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors();
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("NestJS Start Prisma")
    .setDescription(
      "Swagger documentation for the nestjs prisma starter project.",
    )
    .setVersion("1.0")
    .addTag("auth", "Authentication related routes.")
    .addTag("users", "Users related routes.")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter the access token",
        in: "header",
      },
      "jwt-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
