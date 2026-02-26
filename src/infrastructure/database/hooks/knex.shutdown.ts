import { Inject, Injectable, OnApplicationShutdown } from "@nestjs/common";
import type { Knex } from "knex";
import { KNEX } from "../constants/database.constants";

@Injectable()
export class KnexShutdown implements OnApplicationShutdown {
    constructor(@Inject(KNEX) private readonly db: Knex) {}

    async onApplicationShutdown() {
        await this.db.destroy();
    }
}
