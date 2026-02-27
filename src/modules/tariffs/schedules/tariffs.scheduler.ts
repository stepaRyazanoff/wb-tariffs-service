import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { CronJob } from "cron";
import { TariffsService } from "../tariffs.service";
import { APP_CONFIG } from "../../../common/app.constants";
import { todayISO } from "../utils/today-ISO";

@Injectable()
export class TariffsScheduler implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(TariffsScheduler.name);
    private readonly jobName = "wb-tariffs-fetch";

    constructor(
        private readonly tariffsService: TariffsService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit(): void {
        const cronExpr =
            this.configService.get<string>("schedule.wbCron") ??
            APP_CONFIG.CRON.DEFAULT_WB_CRON;

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

                this.logger.log(`Запуск обновления тарифов WB (дата ${date})`);

                try {
                    await this.tariffsService.fetchAndStore(date);

                    this.logger.log(
                        `Тарифы WB успешно обновлены (дата ${date})`,
                    );
                } catch (err: unknown) {
                    const message =
                        err instanceof Error ? err.message : String(err);
                    this.logger.error(
                        `Ошибка обновления тарифов WB (дата ${date}): ${message}`,
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
            `Планировщик WB активирован: "${cronExpr}", TZ="${timezone}"`,
        );
    }

    onModuleDestroy(): void {
        try {
            const job = this.schedulerRegistry.getCronJob(this.jobName);

            void job.stop();

            this.schedulerRegistry.deleteCronJob(this.jobName);

            this.logger.log(`Планировщик WB остановлен: "${this.jobName}"`);
        } catch {
            // ok
        }
    }
}
