export type WbBoxTariffDailyInsert = {
    tariff_date: string;
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

export type WbBoxTariffDailyRow = WbBoxTariffDailyInsert & {
    id: number;
    created_at?: Date;
};

export type WbBoxTariffForSheets = Pick<
    WbBoxTariffDailyRow,
    | "warehouse_name"
    | "geo_name"
    | "box_delivery_base"
    | "box_delivery_coef_expr"
    | "box_delivery_liter"
    | "box_delivery_marketplace_base"
    | "box_delivery_marketplace_coef_expr"
    | "box_delivery_marketplace_liter"
    | "box_storage_base"
    | "box_storage_coef_expr"
    | "box_storage_liter"
    | "fetched_at"
>;
