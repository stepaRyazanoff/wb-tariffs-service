import { Inject, Injectable, Logger } from "@nestjs/common";
import {
    WbBoxTariffDailyInsert,
    WbBoxTariffDailyRow,
    WbBoxTariffForSheets,
} from "./types/wb-box-tariffs.types";
import type { Knex } from "knex";
import { KNEX } from "../../infrastructure/database/constants/database.constants";

@Injectable()
export class TariffsRepository {
    private readonly logger = new Logger(TariffsRepository.name);
    private readonly table = "wb_box_tariffs_daily";

    constructor(@Inject(KNEX) private readonly db: Knex) {}

    async upsertDailyTariffs(rows: WbBoxTariffDailyInsert[]): Promise<void> {
        if (rows.length === 0) {
            return;
        }

        const dedupedRows = this.dedupeRowsByDateAndWarehouse(rows);

        await this.db<WbBoxTariffDailyInsert>(this.table)
            .insert(dedupedRows)
            .onConflict(["tariff_date", "warehouse_name"])
            .merge();
    }

    private dedupeRowsByDateAndWarehouse(
        rows: WbBoxTariffDailyInsert[],
    ): WbBoxTariffDailyInsert[] {
        const uniqueRows = new Map<string, WbBoxTariffDailyInsert>();

        for (const row of rows) {
            const key = `${row.tariff_date}::${row.warehouse_name}`;
            uniqueRows.set(key, row);
        }

        if (uniqueRows.size < rows.length) {
            this.logger.warn(
                `WB upsert: найдено дублей в батче: ${rows.length - uniqueRows.size}, применена дедупликация по (tariff_date, warehouse_name)`,
            );
        }

        return Array.from(uniqueRows.values());
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
