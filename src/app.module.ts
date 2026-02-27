import { Module } from "@nestjs/common";
import { ConfigHostModule } from "./config/config.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { TariffsModule } from "./modules/tariffs/tariffs.module";

@Module({
    imports: [TariffsModule, InfrastructureModule, ConfigHostModule],
    providers: [],
})
export class AppModule {}
