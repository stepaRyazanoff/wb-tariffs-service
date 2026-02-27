import { Module } from "@nestjs/common";
import { TariffsService } from "./tariffs.service";
import { TariffsRepository } from "./tariffs.repository";
import { WbClient } from "./wb-client";
import { WB_API_TOKEN, WB_API_BASE_URL } from "./constants/wb.tokens";
import { TariffsScheduler } from "./tariffs.scheduler";

@Module({
    providers: [
        WbClient,
        TariffsService,
        TariffsRepository,
        TariffsScheduler,
        {
            provide: WB_API_TOKEN,
            useFactory: () => {
                const token = process.env.WB_API_TOKEN;
                if (!token) {
                    throw new Error("Конфигурация: не задан WB_API_TOKEN");
                }
                return token;
            },
        },
        {
            provide: WB_API_BASE_URL,
            useFactory: () => {
                const url = process.env.WB_API_BASE_URL;
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
