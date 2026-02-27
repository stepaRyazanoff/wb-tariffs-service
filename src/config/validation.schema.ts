import Joi from "joi";

export const validationSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid("development", "production", "dev", "prod")
        .optional(),

    APP_PORT: Joi.number().required(),

    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),

    WB_API_TOKEN: Joi.string().required(),
    WB_API_BASE_URL: Joi.string().uri().required(),

    GOOGLE_SHEETS_IDS: Joi.string().required(),
    GOOGLE_SHEETS_TAB: Joi.string().default("stocks_coefs"),

    GOOGLE_SERVICE_ACCOUNT_JSON_PATH: Joi.string().required(),

    WB_CRON: Joi.string().optional(),
    SHEETS_CRON: Joi.string().optional(),
});
