# 🛠 Scripts

Утилитарные скрипты для управления монорепо SSVproff.

## Доступные скрипты

### `migrate-journal.sh`

Миграция статей из внешних репозиториев (например, `ssvproff-journal`) в структуру монорепо.

#### Что делает

1. Клонирует указанный репозиторий-источник во временную папку
2. Находит все `.md` файлы с frontmatter
3. Копирует их в `content/journal/`
4. Создаёт JSON-метаданные в `metadata/journal/`
5. Очищает временные файлы

#### Использование

```bash
# Предварительный просмотр (без записи)
./scripts/migrate-journal.sh --dry-run

# Реальная миграция (из ssvproff-journal по умолчанию)
./scripts/migrate-journal.sh

# Миграция из другого репозитория
./scripts/migrate-journal.sh --source https://github.com/Serg2206/my-articles.git

# Справка
./scripts/migrate-journal.sh --help
```

#### Требования

- `git` — для клонирования источника
- Доступ к репозиторию-источнику (для приватных — настроенный SSH/token)

#### Формат статей

Входные `.md` файлы должны иметь YAML frontmatter:

```yaml
---
title: "Название статьи"
slug: "url-slug"
date: 2026-01-15
authors: ["Автор 1", "Автор 2"]
tags: ["тег1", "тег2"]
abstract: "Краткое описание статьи"
---

## Содержание статьи...
```

#### Выходные файлы

| Путь | Формат | Описание |
|------|--------|---------|
| `content/journal/<slug>.md` | Markdown + YAML frontmatter | Текст статьи |
| `metadata/journal/<slug>.json` | JSON | Метаданные (published, readingTime, doi) |

---

## Будущие скрипты

| Скрипт | Назначение | Step |
|--------|-----------|------|
| `migrate-courses.sh` | Миграция курсов из gastric-surgery-course | 2.3 |
| `migrate-videos.sh` | Миграция видео-ссылок из ssv-video | 2.4 |
| `archive-repos.sh` | Архивация дублирующих репозиториев | 2.5 |
| `check-links.sh` | Проверка внутренних ссылок после миграции | 2.6 |
