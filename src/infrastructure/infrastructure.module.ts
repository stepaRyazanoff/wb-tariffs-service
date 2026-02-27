import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [ScheduleModule.forRoot(), DatabaseModule],
    exports: [],
})
export class InfrastructureModule {}
