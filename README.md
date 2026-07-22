# 🏥 SSVproff

> **Канонический репозиторий** образовательной платформы SSVproff.
> Новые репозитории НЕ создаём — вся разработка идёт здесь.

🌐 **Продакшн:** [proffssv.site](https://proffssv.site)
🚀 **Preview:** [surgical-research-platform-mvp.vercel.app](https://surgical-research-platform-mvp.vercel.app)

---

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | Next.js · TypeScript · Tailwind CSS |
| Backend | Next.js API Routes · Prisma ORM |
| База данных | PostgreSQL (Neon / Supabase) |
| AI/ML | Python · scikit-learn · TensorFlow |
| Медицина | FHIR R4 · HL7 |
| Деплой | Vercel · GitHub Actions |

---

## Экосистема

- [medical-research-repoNS](https://github.com/Serg2206/medical-research-repoNS) — Python-исследования, датасеты и скрипты анализа
- [ssv-video](https://github.com/Serg2206/ssv-video) — автоматизированный генератор видеопакетов для SSVproff
- [ssvproff-journal](https://github.com/Serg2206/ssvproff-journal) — хирургический журнал с AI-интеграцией
- [ssvproff-website-content](https://github.com/Serg2206/ssvproff-website-content) — Markdown-источник сайта ssvnauka.com

---

## Структура репозитория

```
/app          # Next.js App Router: страницы и API-роуты (app/api/*)
/components   # React-компоненты (UI, layout, страницы)
/lib          # Общий код: auth, prisma-клиент, rate-limit, slugs и т.д.
/prisma       # Схема базы данных
/content      # Markdown-контент
/public       # Статические файлы
/scripts      # Служебные скрипты (seed, fix-content)
/docs         # Документация
/metadata     # Метаданные контента
/types        # Общие TypeScript-типы
/hooks        # Общие React-хуки
```

---

## AI-поиск

`/api/ai-search` вызывает внешний прокси **Abacus.ai** (`https://apps.abacus.ai/v1/chat/completions`, модель `gpt-4.1-mini`), а не OpenAI/Anthropic напрямую — проект изначально был собран в app-builder'е Abacus.ai, отсюда и эта зависимость, и файл `.abacus.donotdelete` в корне репозитория (служебный артефакт платформы, не трогать). Нужен ключ `ABACUSAI_API_KEY` (см. `.env.production.example`) — это ключ именно платформы Abacus.ai, а не сторонней LLM напрямую. Без него `/api/ai-search` отвечает 503, остальной сайт работает нормально.

Поиск по курсам/статьям (`Prisma` `contains`-запрос) и поиск по `/knowledge` (клиентский индекс Lunr.js) — две независимые системы, не объединены; это известное ограничение, а не недосмотр.

**Известное ограничение производительности:** `contains`-поиск по курсам/статьям (`app/api/ai-search`, `app/api/courses`) сейчас идёт полным сканированием — обычный B-tree `@@index` в Postgres не ускоряет LIKE `%term%`. Для реального ускорения нужен `pg_trgm` (GIN-индекс по триграммам) или `tsvector` полнотекстовый индекс — это отдельная миграция БД, которую нужно применять и проверять на живой базе (Neon/Supabase), а не вслепую из кода.

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/Serg2206/surgical-research-platform-mvp.git
cd surgical-research-platform-mvp

# Установить зависимости
npm install

# Настроить окружение
cp .env.example .env.local

# Запустить dev-сервер
npm run dev
```

---

## Лицензия

MIT © 2024–2026 Prof. Shapovalov V.V. (SSVproff)

---

> 📌 **Правило:** Этот репозиторий — единственная точка входа для всей платформы SSVproff.
> Не создавайте новые репозитории. Всё добавляем сюда.
