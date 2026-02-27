export const APP_CONFIG = {
    DB: {
        /**
         *  Минимальное количество открытых соединений - 0
         */
        DB_POOL_MIN: 0,
        /**
         *  Максимальное количество открытых соединений - 10
         */
        DB_POOL_MAX: 10,
    } as const,

    URL: {
        /**
         * Возвращает информацию о стоимости хранения и доставки коробов по дате:
         *
         *  GET /api/v1/tariffs/box?date=YYYY-MM-DD
         */
        WB_TARIFFS_BOX_PATH: "/api/v1/tariffs/box",
    } as const,
};
