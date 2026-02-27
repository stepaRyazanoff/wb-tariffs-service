import { TariffsSheetRow } from "../types/tariffs-sheet-row.type";

export function mapTariffsSheetRowToValues(row: TariffsSheetRow): string[] {
    return [
        row.warehouse_name ?? "",
        row.geo_name ?? "",

        row.box_delivery_base ?? "",
        row.box_delivery_coef_expr ?? "",
        row.box_delivery_liter ?? "",

        row.box_delivery_marketplace_base ?? "",
        row.box_delivery_marketplace_coef_expr ?? "",
        row.box_delivery_marketplace_liter ?? "",

        row.box_storage_base ?? "",
        row.box_storage_coef_expr ?? "",
        row.box_storage_liter ?? "",

        row.fetched_at ? row.fetched_at.toISOString() : "",
    ];
}
