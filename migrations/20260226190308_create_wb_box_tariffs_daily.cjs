exports.up = async function (knex) {
    await knex.schema.createTable("wb_box_tariffs_daily", t => {
        t.bigIncrements("id").primary();

        t.date("tariff_date").notNullable();

        t.text("warehouse_name").notNullable();
        t.text("geo_name").nullable();

        t.decimal("box_delivery_base", 14, 4).nullable();
        t.decimal("box_delivery_coef_expr", 14, 4).nullable();
        t.decimal("box_delivery_liter", 14, 4).nullable();

        t.decimal("box_delivery_marketplace_base", 14, 4).nullable();
        t.decimal("box_delivery_marketplace_coef_expr", 14, 4).nullable();
        t.decimal("box_delivery_marketplace_liter", 14, 4).nullable();

        t.decimal("box_storage_base", 14, 4).nullable();
        t.decimal("box_storage_coef_expr", 14, 4).nullable();
        t.decimal("box_storage_liter", 14, 4).nullable();

        t.timestamp("fetched_at", { useTz: true }).notNullable();

        t.timestamp("created_at").defaultTo(knex.fn.now());

        t.unique(["tariff_date", "warehouse_name"], {
            indexName: "uq_wb_box_tariffs_daily_date_warehouse",
        });

        t.index(["tariff_date"], "idx_wb_box_tariffs_daily_date");
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("wb_box_tariffs_daily");
};
