import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "./modules/app/app.const";
import { AppModule } from "./modules/app/app.module";

const DEFAULT_PORT = 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const backendAppPort = configService.get("BACKEND_APP_PORT", DEFAULT_PORT);

  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(backendAppPort);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
