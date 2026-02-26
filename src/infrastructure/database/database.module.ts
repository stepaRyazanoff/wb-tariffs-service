import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import knex, { Knex } from "knex";
import { KNEX } from "./constants/database.constants";
import { buildKnexConfig } from "./config/knex.config";
import { KnexShutdown } from "./hooks/knex.shutdown";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: KNEX,
            inject: [ConfigService],
            useFactory: async (config: ConfigService): Promise<Knex> => {
                const db = knex(buildKnexConfig(config));
                await db.raw("select 1");
                return db;
            },
        },
        KnexShutdown,
    ],
    exports: [KNEX],
})
export class DatabaseModule {}
