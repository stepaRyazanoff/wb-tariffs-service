import { Inject, Injectable } from "@nestjs/common";
import { WbBoxTariffsResponse } from "./types/wb-box-response.type";
import { WB_API_TOKEN, WB_API_BASE_URL } from "./constants/wb.tokens";
import { APP_CONFIG } from "../../common/app.constants";

@Injectable()
export class WbClient {
    constructor(
        @Inject(WB_API_TOKEN) private readonly token: string,
        @Inject(WB_API_BASE_URL) private readonly baseUrl: string,
    ) {}

    async fetchBoxTariffs(dateISO: string): Promise<WbBoxTariffsResponse> {
        const url = new URL(APP_CONFIG.URL.WB_TARIFFS_BOX_PATH, this.baseUrl);
        url.searchParams.set("date", dateISO);

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Authorization: this.token,
                },
            });

            if (!response.ok) {
                const text = await response.text();

                throw new Error(
                    `WB API: ошибка HTTP ${response.status} (дата ${dateISO}): ${text}`,
                );
            }

            return (await response.json()) as WbBoxTariffsResponse;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);

            throw new Error(
                `WB API: не удалось получить тарифы коробов (дата ${dateISO}): ${message}`,
            );
        }
    }
}
