import { Injectable, Logger } from "@nestjs/common";
import { TariffsRepository } from "./tariffs.repository";
import { mapWbBoxTariffToDailyInsert } from "./mappers/map-wb-box-to-insert";
import { WbBoxWarehouseTariffApi } from "./types/wb-box-api.type";
import { WbClient } from "./wb-client";

@Injectable()
export class TariffsService {
    private readonly logger = new Logger(TariffsService.name);

    constructor(
        private readonly repository: TariffsRepository,
        private readonly wbClient: WbClient,
    ) {}

    async upsertFromWbArray(
        dateISO: string,
        items: WbBoxWarehouseTariffApi[],
    ): Promise<void> {
        const fetchedAt = new Date();

        const rows = items.map(it =>
            mapWbBoxTariffToDailyInsert(dateISO, it, fetchedAt),
        );

        await this.repository.upsertDailyTariffs(rows);
    }

    async fetchAndStore(dateISO: string): Promise<void> {
        const result = await this.wbClient.fetchBoxTariffs(dateISO);

        const data = result.response?.data;

        if (!data) {
            throw new Error("WB API: в ответе отсутствует поле data");
        }

        const list = data.warehouseList ?? [];

        if (list.length === 0) {
            this.logger.warn(`WB API: warehouseList пустой (дата ${dateISO})`);

            return;
        }

        await this.upsertFromWbArray(dateISO, list);

        this.logger.log(
            `WB API: сохранено тарифов: ${list.length} (дата ${dateISO})`,
        );
    }
}
