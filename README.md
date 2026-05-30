# 🏥 SSVproff — Surgical Research Platform

> **Канонический репозиторий** платформы хирургических исследований проф. Шаповалова В.В.
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

## Структура монорепо

```
/api          # Backend API (FastAPI или Next.js API routes)
/web          # Frontend Next.js static export
/ai           # ML-модели прогноза риска
/tools        # Утилиты (video, book, monetization generators)
/flows        # Рабочие процессы и автоматизации
/data-meta    # Метаданные, схемы, миграции
/docs         # Документация
```

---

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
