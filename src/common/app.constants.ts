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

    CRON: {
        /**
         * "0 * * * *" — запуск каждый час в начале часа
         */
        DEFAULT_WB_CRON: "0 * * * *",
        /**
         * Cron для запуска синхронизации таблиц каждые 10 минут
         */
        DEFAULT_SHEETS_CRON: "*/10 * * * *",
        /**
         * Europe/Moscow — московское время
         */
        DEFAULT_TIMEZONE: "Europe/Moscow",
    } as const,

    GOOGLE: {
        /**
         * Scope для доступа к Google Sheets API
         */
        SPREADSHEETS_SCOPE: "https://www.googleapis.com/auth/spreadsheets",
        /**
         * Режим записи значений в Google Sheets
         */
        VALUE_INPUT_OPTION_RAW: "RAW",
        /**
         * Стартовая ячейка для записи данных
         */
        START_CELL: "A1",
    } as const,
};
