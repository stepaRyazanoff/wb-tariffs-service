# 📦 WB Tariffs Service

Сервис на NestJS, который решает две задачи:

1. Регулярно получает тарифы WB для коробов и сохраняет их в PostgreSQL по дням.
2. Регулярно обновляет актуальные тарифы из PostgreSQL в Google Sheets (лист `stocks_coefs`) для `N` таблиц.

---

## 🧾 Стек технологий

- [NestJS](https://nestjs.com) — backend
- [PostgreSQL](https://www.postgresql.org/) — СУБД
- [Knex.js](https://knexjs.org/) — работа с БД и миграции
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Docker + Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Требования

- Docker + Docker Compose
- Доступ к WB API (токен)
- Google Service Account JSON с доступом на редактирование нужных таблиц

---

## 📝 Настройка конфигурации

В проекте в `docker-compose.yml` используется `.env.example` как файл окружения контейнеров.

Перед запуском подставьте в `.env.example` реальные значения:

```env
# порты
APP_PORT=3005

# Postgres (по ТЗ: postgres/postgres/postgres)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_HOST=postgres

# WB / Google
WB_API_TOKEN=your_wb_token
WB_API_BASE_URL=https://common-api.wildberries.ru
GOOGLE_SHEETS_IDS=spreadsheet_id_1,spreadsheet_id_2
GOOGLE_SERVICE_ACCOUNT_JSON_PATH=secrets/google_sa.json
GOOGLE_SHEETS_TAB=stocks_coefs

# Cron
WB_CRON=0 * * * *
SHEETS_CRON=*/10 * * * *
WB_TZ=Europe/Moscow
```

Создайте файл сервисного аккаунта Google:

```bash
cp secrets/google_sa.json.example secrets/google_sa.json
```

После этого вставьте в `secrets/google_sa.json` реальные ключи сервисного аккаунта.

Важно: сервисный аккаунт должен иметь роль `Editor` для каждой таблицы из `GOOGLE_SHEETS_IDS`.

---

## 🚀 Запуск проекта

Запуск по ТЗ одной командой:

```bash
docker compose up --build
```

Что происходит при старте:

1. Поднимается PostgreSQL.
2. `backend-dev` ждет healthcheck БД.
3. На старте backend выполняются миграции (`npm run migrate:dev`).
4. Запускается приложение (`npm run start:dev`).

Остановка:

```bash
docker compose down
```

---

## 🧠 Как работает сервис

### 1) Сбор тарифов WB

- Endpoint WB: `GET https://common-api.wildberries.ru/api/v1/tariffs/box?date=YYYY-MM-DD`
- Планировщик: `WB_CRON` (по умолчанию: каждый час)
- Данные за день сохраняются в таблицу `wb_box_tariffs_daily`
- В течение дня записи обновляются через upsert (по ключу `tariff_date + warehouse_name`)

### 2) Синхронизация в Google Sheets

- Планировщик: `SHEETS_CRON` (по умолчанию: каждые 10 минут)
- Из БД берутся данные за текущую дату
- Данные сортируются по возрастанию `box_delivery_coef_expr`
- Выполняется перезапись листа `stocks_coefs` для всех `GOOGLE_SHEETS_IDS`

---

## ✅ Проверка работоспособности

Логи сервиса:

```bash
docker compose logs -f backend-dev
```

Ожидаемые сообщения:

- `Планировщик WB активирован`
- `Планировщик Sheets активирован`
- `WB API: сохранено тарифов: ...`
- `Google Sheets: обновил ...`

Проверка данных в БД:

```bash
docker compose exec postgres psql -U postgres -d postgres -c "select tariff_date, count(*) from wb_box_tariffs_daily group by tariff_date order by tariff_date desc;"
```

Проверка Google Sheets:

1. Откройте таблицу по ID из `GOOGLE_SHEETS_IDS`.
2. Проверьте лист `stocks_coefs`.
3. Убедитесь, что данные обновляются и отсортированы по `box_delivery_coef_expr`.

---

## 🐳 Работа с контейнером `backend-dev`

Если запускать `npm run migrate:dev`/`rollback:*` на хосте, переменные `POSTGRES_*` из Docker могут не подхватиться.
Поэтому миграции и откаты лучше выполнять внутри контейнера:

```bash
docker compose exec backend-dev npm run migrate:dev
docker compose exec backend-dev npm run rollback:dev
docker compose exec backend-dev npm run rollback:dev:all
```

Как зайти в контейнер вручную:

```bash
docker compose exec backend-dev sh
```

Выход из контейнера:

```bash
exit
```

---

## ⚡ Полезные команды

| Действие                       | Команда                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| Запуск (по ТЗ)                 | `docker compose up --build`                                |
| Запуск в фоне                  | `npm run dev:up`                                           |
| Остановка                      | `npm run dev:down`                                         |
| Логи backend                   | `npm run dev:logs`                                         |
| Состояние контейнеров          | `npm run dev:ps`                                           |
| Применить миграции (Docker)    | `docker compose exec backend-dev npm run migrate:dev`      |
| Откатить 1 миграцию (Docker)   | `docker compose exec backend-dev npm run rollback:dev`     |
| Откатить все миграции (Docker) | `docker compose exec backend-dev npm run rollback:dev:all` |
| Войти в контейнер backend      | `docker compose exec backend-dev sh`                       |
| Проверка линта                 | `npm run lint:check`                                       |
| Проверка типов                 | `npm run typecheck`                                        |

---

## 🔐 Безопасность конфигурации

В репозитории хранятся только шаблоны конфигурации без чувствительных данных:

- `.env.example`
- `secrets/google_sa.json.example`

Реальные токены и ключи в git не добавляются.

---

## 📬 Контакты

- Разработчик: Saprankov Prokhor
- Telegram: @Proha_Sap
- Email: stepa.ryazanoff@gmail.com
- GitHub: https://github.com/stepaRyazanoff
