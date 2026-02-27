import { APP_CONFIG } from "../common/app.constants";

export default () => ({
    port: parseInt(process.env.APP_PORT || "3000", 10),

    database: {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        name: process.env.POSTGRES_DB,
    },

    wb: {
        token: process.env.WB_API_TOKEN,
        wbApiBaseUrl: process.env.WB_API_BASE_URL,
    },

    sheets: {
        spreadsheetIds: (process.env.GOOGLE_SHEETS_IDS || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),

        sheetName: process.env.GOOGLE_SHEETS_TAB || "stocks_coefs",

        serviceAccountJsonPath: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
    },

    schedule: {
        wbCron: process.env.WB_CRON || APP_CONFIG.CRON.DEFAULT_WB_CRON,
        sheetsCron:
            process.env.SHEETS_CRON || APP_CONFIG.CRON.DEFAULT_SHEETS_CRON,
        timezone: process.env.WB_TZ || APP_CONFIG.CRON.DEFAULT_TIMEZONE,
    },
});
