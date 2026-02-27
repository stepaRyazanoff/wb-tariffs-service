export function buildTariffsSheetHeader(): string[] {
    return [
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
    ];
}
