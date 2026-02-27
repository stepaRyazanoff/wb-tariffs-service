import { Inject, Injectable } from "@nestjs/common";
import {
    WbBoxTariffDailyInsert,
    WbBoxTariffDailyRow,
    WbBoxTariffForSheets,
} from "./types/wb-box-tariffs.types";
import type { Knex } from "knex";
import { KNEX } from "../../infrastructure/database/constants/database.constants";

@Injectable()
export class TariffsRepository {
    private readonly table = "wb_box_tariffs_daily";

    constructor(@Inject(KNEX) private readonly db: Knex) {}

    async upsertDailyTariffs(rows: WbBoxTariffDailyInsert[]): Promise<void> {
        if (rows.length === 0) {
            return;
        }

        await this.db<WbBoxTariffDailyInsert>(this.table)
            .insert(rows)
            .onConflict(["tariff_date", "warehouse_name"])
            .merge();
    }

    async getDailyTariffsForSheets(
        dateISO: string,
    ): Promise<WbBoxTariffForSheets[]> {
        return this.db<WbBoxTariffDailyRow>(this.table)
            .select(
                "warehouse_name",
                "geo_name",
                "box_delivery_base",
                "box_delivery_coef_expr",
                "box_delivery_liter",
                "box_delivery_marketplace_base",
                "box_delivery_marketplace_coef_expr",
                "box_delivery_marketplace_liter",
                "box_storage_base",
                "box_storage_coef_expr",
                "box_storage_liter",
                "fetched_at",
            )
            .where({ tariff_date: dateISO })
            .orderByRaw("box_delivery_coef_expr asc nulls last");
    }
}
