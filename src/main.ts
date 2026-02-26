import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);
    const port: number = config.get<number>("port") || 3000;

    app.enableCors();
    app.useGlobalPipes();

    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}`);
}

void bootstrap();
