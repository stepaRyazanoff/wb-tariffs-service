import { Injectable, Logger } from "@nestjs/common";
import { TariffsRepository } from "./tariffs.repository";
import { GoogleSheetsService } from "../google-sheets/google-sheets.service";

@Injectable()
export class TariffsSheetsSyncService {
    private readonly logger = new Logger(TariffsSheetsSyncService.name);

    constructor(
        private readonly repository: TariffsRepository,
        private readonly sheets: GoogleSheetsService,
    ) {}

    async syncDailyTariffsToSheets(dateISO: string): Promise<void> {
        const rows = await this.repository.getDailyTariffsForSheets(dateISO);

        if (rows.length === 0) {
            this.logger.warn(
                `Синхронизация Sheets: нет данных в БД за дату ${dateISO}`,
            );

            return;
        }

        await this.sheets.overwriteTariffsSheet(rows);

        this.logger.log(
            `Синхронизация Sheets завершена (дата ${dateISO}), строк: ${rows.length}`,
        );
    }
}
