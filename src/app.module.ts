import { Module } from "@nestjs/common";
import { ConfigHostModule } from "./config/config.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

@Module({
    imports: [InfrastructureModule, ConfigHostModule],
    providers: [],
})
export class AppModule {}
