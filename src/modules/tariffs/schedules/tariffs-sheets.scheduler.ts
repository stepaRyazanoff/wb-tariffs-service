import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { CronJob } from "cron";
import { TariffsSheetsSyncService } from "../tariffs-sheets-sync.service";
import { APP_CONFIG } from "../../../common/app.constants";
import { todayISO } from "../utils/today-ISO";

@Injectable()
export class TariffsSheetsScheduler implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(TariffsSheetsScheduler.name);
    private readonly jobName = "wb-tariffs-sheets-sync";

    constructor(
        private readonly syncService: TariffsSheetsSyncService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit(): void {
        const cronExpr =
            this.configService.get<string>("schedule.sheetsCron") ??
            APP_CONFIG.CRON.DEFAULT_SHEETS_CRON;

        const timezone =
            this.configService.get<string>("schedule.timezone") ??
            APP_CONFIG.CRON.DEFAULT_TIMEZONE;

        // Если вдруг перезапуск/перезагрузка — чистит старую задачу
        try {
            this.schedulerRegistry.deleteCronJob(this.jobName);
        } catch {
            // ok
        }

        const job = new CronJob(
            cronExpr,
            async () => {
                const date = todayISO(timezone);
                this.logger.log(
                    `Запуск синхронизации тарифов в Google Sheets (дата ${date})`,
                );

                try {
                    await this.syncService.syncDailyTariffsToSheets(date);

                    this.logger.log(
                        `Синхронизация Google Sheets успешна (дата ${date})`,
                    );
                } catch (err: unknown) {
                    const message =
                        err instanceof Error ? err.message : String(err);
                    this.logger.error(
                        `Ошибка синхронизации Google Sheets (дата ${date}): ${message}`,
                    );
                }
            },
            null,
            false,
            timezone,
        );

        this.schedulerRegistry.addCronJob(this.jobName, job);
        job.start();

        this.logger.log(
            `Планировщик Sheets активирован: "${cronExpr}", TZ="${timezone}"`,
        );
    }

    onModuleDestroy(): void {
        try {
            const job = this.schedulerRegistry.getCronJob(this.jobName);
            void job.stop();
            this.schedulerRegistry.deleteCronJob(this.jobName);
            this.logger.log(`Планировщик Sheets остановлен: "${this.jobName}"`);
        } catch {
            // ok
        }
    }
}
