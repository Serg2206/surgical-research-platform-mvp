# MySQL preparation for proffssv.site

## Текущее состояние

- Проект использует Prisma.
- В `prisma/schema.prisma` сейчас указан провайдер `postgresql`.
- Переменная подключения: `DATABASE_URL`.
- В схеме есть PostgreSQL-специфичные поля `String[]`, которые для MySQL нужно заменить на `Json` или вынести в отдельные таблицы.

## Что нужно решить перед миграцией

1. Где будет размещена MySQL-база: Vercel Marketplace, внешний хостинг, VPS или текущий хостинг `proffssv.site`.
2. Нужна ли полная миграция с PostgreSQL на MySQL или отдельная MySQL-база для нового модуля.
3. Какие данные уже есть в production и нужно ли их переносить.
4. Какие окружения подключать: Production, Preview, Development.

## Безопасный порядок работ

1. Создать MySQL-базу и отдельного пользователя с минимальными правами.
2. Сохранить `DATABASE_URL` только как секрет в Vercel и локальном `.env`, не в документации.
3. Подготовить отдельную ветку миграции Prisma.
4. Заменить PostgreSQL-специфичные поля:
   - `Course.learningObjectives String[]`
   - другие массивы, если они появятся
5. Выполнить `prisma validate`.
6. Создать и проверить миграцию на пустой/staging-базе.
7. После проверки переключить production-переменную `DATABASE_URL`.

## Формат MySQL DATABASE_URL

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Следующий практический шаг

Получить MySQL host, database, user, password и порт. После этого можно подготовить Prisma-миграцию и проверить сборку проекта.
