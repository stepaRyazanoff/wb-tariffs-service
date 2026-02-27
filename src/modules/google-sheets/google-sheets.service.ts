import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google, sheets_v4 } from "googleapis";
import { TariffsSheetRow } from "./types/tariffs-sheet-row.type";
import { mapTariffsSheetRowToValues } from "./mappers/map-tariffs-sheet-row-to-values";
import { buildTariffsSheetHeader } from "./utils/build-tariffs-sheet-header";
import { APP_CONFIG } from "../../common/app.constants";

@Injectable()
export class GoogleSheetsService {
    private readonly logger = new Logger(GoogleSheetsService.name);
    private readonly sheets: sheets_v4.Sheets;

    private readonly spreadsheetIds: string[];
    private readonly sheetName: string;

    constructor(private readonly config: ConfigService) {
        const serviceAccountPath = this.config.get<string>(
            "sheets.serviceAccountJsonPath",
        );

        if (!serviceAccountPath) {
            throw new Error(
                "Конфигурация: не задан GOOGLE_SERVICE_ACCOUNT_JSON_PATH",
            );
        }

        this.spreadsheetIds =
            this.config.get<string[]>("sheets.spreadsheetIds") ?? [];

        if (this.spreadsheetIds.length === 0) {
            throw new Error(
                "Конфигурация: не задан GOOGLE_SHEETS_IDS (список пуст)",
            );
        }

        this.sheetName =
            this.config.get<string>("sheets.sheetName") ?? "stocks_coefs";

        const auth = new google.auth.GoogleAuth({
            keyFile: serviceAccountPath,
            scopes: [APP_CONFIG.GOOGLE.SPREADSHEETS_SCOPE],
        });

        this.sheets = google.sheets({ version: "v4", auth });
    }

    async overwriteTariffsSheet(rows: TariffsSheetRow[]): Promise<void> {
        const values = [
            buildTariffsSheetHeader(),
            ...rows.map(row => mapTariffsSheetRowToValues(row)),
        ];
        const failedSpreadsheetIds: string[] = [];

        for (const spreadsheetId of this.spreadsheetIds) {
            try {
                await this.sheets.spreadsheets.values.clear({
                    spreadsheetId,
                    range: this.sheetName,
                });

                await this.sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `${this.sheetName}!${APP_CONFIG.GOOGLE.START_CELL}`,
                    valueInputOption: APP_CONFIG.GOOGLE.VALUE_INPUT_OPTION_RAW,
                    requestBody: { values },
                });

                this.logger.log(
                    `Google Sheets: обновил ${spreadsheetId} (${this.sheetName}), строк: ${rows.length}`,
                );
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                failedSpreadsheetIds.push(spreadsheetId);
                this.logger.error(
                    `Google Sheets: ошибка обновления ${spreadsheetId} (${this.sheetName}): ${message}`,
                );
            }
        }

        if (failedSpreadsheetIds.length > 0) {
            throw new Error(
                `Google Sheets: не удалось обновить ${failedSpreadsheetIds.length} из ${this.spreadsheetIds.length} таблиц: ${failedSpreadsheetIds.join(", ")}`,
            );
        }
    }
}
