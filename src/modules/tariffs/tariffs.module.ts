import { Module } from "@nestjs/common";
import { TariffsService } from "./tariffs.service";
import { TariffsRepository } from "./tariffs.repository";
import { WbClient } from "./wb-client";
import { WB_API_TOKEN, WB_API_BASE_URL } from "./constants/wb.tokens";
import { TariffsScheduler } from "./schedules/tariffs.scheduler";
import { TariffsSheetsScheduler } from "./schedules/tariffs-sheets.scheduler";
import { TariffsSheetsSyncService } from "./tariffs-sheets-sync.service";
import { GoogleSheetsModule } from "../google-sheets/google-sheets.module";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [GoogleSheetsModule],
    providers: [
        WbClient,
        TariffsService,
        TariffsRepository,
        TariffsScheduler,
        TariffsSheetsScheduler,
        TariffsSheetsSyncService,
        {
            provide: WB_API_TOKEN,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const token = config.get<string>("wb.token");

                if (!token) {
                    throw new Error("Конфигурация: не задан WB_API_TOKEN");
                }

                return token;
            },
        },
        {
            provide: WB_API_BASE_URL,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const url = config.get<string>("wb.wbApiBaseUrl");

                if (!url) {
                    throw new Error("Конфигурация: не задан WB_API_BASE_URL");
                }

                return url;
            },
        },
    ],
    exports: [TariffsService],
})
export class TariffsModule {}
