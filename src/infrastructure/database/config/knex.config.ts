import type { Knex } from "knex";
import { ConfigService } from "@nestjs/config";
import { APP_CONFIG } from "../../../common/app.constants";

export function buildKnexConfig(config: ConfigService): Knex.Config {
    const host = config.get<string>("database.host");
    const port = config.get<number>("database.port");
    const user = config.get<string>("database.user");
    const password = config.get<string>("database.password");
    const database = config.get<string>("database.name");

    return {
        client: "pg",
        connection: {
            host,
            port,
            user,
            password,
            database,
        },
        pool: {
            min: APP_CONFIG.DB.DB_POOL_MIN,
            max: APP_CONFIG.DB.DB_POOL_MAX,
        },
    };
}
