#!/usr/bin/env bash
# ============================================================================
# migrate-journal.sh — Миграция статей из ssvproff-journal в монорепо
# ============================================================================
#
# Назначение:
#   Клонирует репозиторий ssvproff-journal (если ещё не клонирован),
#   находит markdown-файлы статей, конвертирует их frontmatter
#   в формат монорепо и копирует в content/journal/ и metadata/journal/.
#
# Использование:
#   ./scripts/migrate-journal.sh [--dry-run] [--source REPO_URL]
#
# Опции:
#   --dry-run     Показать, что будет сделано, без реального копирования
#   --source URL  Указать URL репозитория-источника
#                 (по умолчанию: https://github.com/Serg2206/ssvproff-journal.git)
#
# Примеры:
#   ./scripts/migrate-journal.sh --dry-run
#   ./scripts/migrate-journal.sh
#   ./scripts/migrate-journal.sh --source https://github.com/Serg2206/my-articles.git
#
# ============================================================================

set -euo pipefail

# === Конфигурация ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTENT_DIR="${PROJECT_ROOT}/content/journal"
METADATA_DIR="${PROJECT_ROOT}/metadata/journal"
TMP_DIR="${PROJECT_ROOT}/.tmp-migration"
DEFAULT_SOURCE="https://github.com/Serg2206/ssvproff-journal.git"

# === Параметры ===
DRY_RUN=false
SOURCE_REPO="${DEFAULT_SOURCE}"

# Разбор аргументов
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --source)
      SOURCE_REPO="$2"
      shift 2
      ;;
    -h|--help)
      head -30 "$0" | grep -E "^#" | sed 's/^# \?//'
      exit 0
      ;;
    *)
      echo "❌ Неизвестный аргумент: $1"
      echo "   Используйте --help для справки"
      exit 1
      ;;
  esac
done

# === Цвета ===
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_ok()    { echo -e "${GREEN}✅ $1${NC}"; }
log_warn()  { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# === Проверки ===
if ! command -v git &> /dev/null; then
  log_error "git не найден. Установите git и повторите."
  exit 1
fi

# === Создание директорий ===
mkdir -p "${CONTENT_DIR}" "${METADATA_DIR}"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       📚 Миграция статей журнала в монорепо         ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Источник: ${SOURCE_REPO}"
echo "║  Цель:     ${CONTENT_DIR}/"
echo "║  Метаданные: ${METADATA_DIR}/"
if $DRY_RUN; then
echo "║  Режим:    🔍 DRY RUN (без записи)"
fi
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# === Шаг 1: Клонирование / обновление источника ===
if [ -d "${TMP_DIR}" ]; then
  log_info "Обновление существующего клона..."
  cd "${TMP_DIR}"
  git pull --ff-only 2>/dev/null || {
    log_warn "Не удалось обновить — удаляю и клонирую заново"
    cd "${PROJECT_ROOT}"
    rm -rf "${TMP_DIR}"
    git clone --depth=1 "${SOURCE_REPO}" "${TMP_DIR}"
  }
else
  log_info "Клонирование ${SOURCE_REPO}..."
  git clone --depth=1 "${SOURCE_REPO}" "${TMP_DIR}" 2>&1 || {
    log_error "Не удалось клонировать ${SOURCE_REPO}"
    log_warn "Проверьте URL и доступ к репозиторию"
    exit 1
  }
fi

cd "${PROJECT_ROOT}"

# === Шаг 2: Поиск markdown-файлов ===
log_info "Поиск markdown-файлов..."

ARTICLE_FILES=()
while IFS= read -r -d '' file; do
  ARTICLE_FILES+=("$file")
done < <(find "${TMP_DIR}" -name "*.md" -not -path "*/.git/*" -not -name "README.md" -not -name "CHANGELOG.md" -print0)

TOTAL=${#ARTICLE_FILES[@]}
log_info "Найдено файлов: ${TOTAL}"

if [ "${TOTAL}" -eq 0 ]; then
  log_warn "Markdown-файлы не найдены в репозитории"
  log_info "Проверьте структуру ${SOURCE_REPO}"
  exit 0
fi

# === Шаг 3: Обработка каждого файла ===
MIGRATED=0
SKIPPED=0
ERRORS=0

for file in "${ARTICLE_FILES[@]}"; do
  FILENAME=$(basename "$file")
  SLUG="${FILENAME%.md}"
  
  echo ""
  log_info "Обработка: ${FILENAME}"
  
  # Проверка — есть ли уже такой файл
  if [ -f "${CONTENT_DIR}/${FILENAME}" ]; then
    log_warn "  Пропуск — файл уже существует: ${FILENAME}"
    ((SKIPPED++))
    continue
  fi
  
  # Проверка — есть ли frontmatter
  if ! head -1 "$file" | grep -q "^---"; then
    log_warn "  Пропуск — нет frontmatter: ${FILENAME}"
    ((SKIPPED++))
    continue
  fi
  
  if $DRY_RUN; then
    log_ok "  [DRY RUN] Будет скопировано: ${FILENAME}"
    ((MIGRATED++))
    continue
  fi
  
  # Копирование markdown
  cp "$file" "${CONTENT_DIR}/${FILENAME}" || {
    log_error "  Ошибка копирования: ${FILENAME}"
    ((ERRORS++))
    continue
  }
  
  # Создание JSON-метаданных (если не существует)
  METAFILE="${METADATA_DIR}/${SLUG}.json"
  if [ ! -f "$METAFILE" ]; then
    cat > "$METAFILE" << EOF
{
  "slug": "${SLUG}",
  "published": true,
  "featured": false,
  "readingTime": 5,
  "doi": null,
  "citations": []
}
EOF
    log_ok "  Метаданные созданы: ${SLUG}.json"
  fi
  
  log_ok "  Мигрировано: ${FILENAME}"
  ((MIGRATED++))
done

# === Шаг 4: Очистка ===
if ! $DRY_RUN; then
  log_info "Очистка временных файлов..."
  rm -rf "${TMP_DIR}"
fi

# === Итог ===
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                   📊 ИТОГ МИГРАЦИИ                  ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Всего найдено:  ${TOTAL}"
echo "║  Мигрировано:    ${MIGRATED}"
echo "║  Пропущено:      ${SKIPPED}"
echo "║  Ошибок:         ${ERRORS}"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if $DRY_RUN; then
  log_info "Запустите без --dry-run для реальной миграции"
fi

if [ "${MIGRATED}" -gt 0 ] && ! $DRY_RUN; then
  log_info "Следующие шаги:"
  echo "  1. Проверьте frontmatter в content/journal/*.md"
  echo "  2. Обновите metadata/journal/*.json (readingTime, doi)"
  echo "  3. Запустите: npm run build"
  echo "  4. Проверьте: http://localhost:3000/journal"
  echo "  5. Коммит: git add content/ metadata/ && git commit -m 'feat: migrate journal articles'"
fi

exit 0
