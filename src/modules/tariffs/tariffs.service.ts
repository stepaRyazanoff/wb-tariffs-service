import { Injectable } from "@nestjs/common";
import { TariffsRepository } from "./tariffs.repository";
import { mapWbBoxTariffToDailyInsert } from "./mappers/map-wb-box-to-insert";
import { WbBoxWarehouseTariffApi } from "./types/wb-box-api.type";

@Injectable()
export class TariffsService {
    constructor(private readonly repository: TariffsRepository) {}

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
}
