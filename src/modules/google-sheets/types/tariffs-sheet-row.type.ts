export type TariffsSheetRow = {
    warehouse_name: string;
    geo_name: string | null;

    box_delivery_base: string | null;
    box_delivery_coef_expr: string | null;
    box_delivery_liter: string | null;

    box_delivery_marketplace_base: string | null;
    box_delivery_marketplace_coef_expr: string | null;
    box_delivery_marketplace_liter: string | null;

    box_storage_base: string | null;
    box_storage_coef_expr: string | null;
    box_storage_liter: string | null;

    fetched_at: Date;
};
