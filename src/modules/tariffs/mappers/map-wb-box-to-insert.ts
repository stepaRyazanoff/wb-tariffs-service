import { WbBoxWarehouseTariffApi } from "../types/wb-box-api.type";
import { WbBoxTariffDailyInsert } from "../types/wb-box-tariffs.types";
import { emptyToNull, parseWbNumeric } from "../utils/parse-wb-numeric";

export function mapWbBoxTariffToDailyInsert(
    dateISO: string,
    item: WbBoxWarehouseTariffApi,
    fetchedAt: Date,
): WbBoxTariffDailyInsert {
    return {
        tariff_date: dateISO,
        warehouse_name: item.warehouseName,
        geo_name: emptyToNull(item.geoName),

        box_delivery_base: parseWbNumeric(item.boxDeliveryBase),
        box_delivery_coef_expr: parseWbNumeric(item.boxDeliveryCoefExpr),
        box_delivery_liter: parseWbNumeric(item.boxDeliveryLiter),

        box_delivery_marketplace_base: parseWbNumeric(
            item.boxDeliveryMarketplaceBase,
        ),
        box_delivery_marketplace_coef_expr: parseWbNumeric(
            item.boxDeliveryMarketplaceCoefExpr,
        ),
        box_delivery_marketplace_liter: parseWbNumeric(
            item.boxDeliveryMarketplaceLiter,
        ),

        box_storage_base: parseWbNumeric(item.boxStorageBase),
        box_storage_coef_expr: parseWbNumeric(item.boxStorageCoefExpr),
        box_storage_liter: parseWbNumeric(item.boxStorageLiter),

        fetched_at: fetchedAt,
    };
}
