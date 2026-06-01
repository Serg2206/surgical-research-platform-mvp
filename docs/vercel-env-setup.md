# Настройка переменных окружения в Vercel

## Обязательные переменные для SEO

Без этих переменных OG-теги будут указывать на `localhost` или Vercel-домен вместо `proffssv.site`.

| Переменная | Значение | Описание |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://proffssv.site` | Базовый URL сайта для canonical, OG, sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@proffssv.site` | Публичный email на странице контактов |
| `NEXT_PUBLIC_TWITTER_HANDLE` | опционально | Twitter/X аккаунт для Twitter Card, если он есть |
| `ABACUSAI_API_KEY` | секретное значение | Ключ для AI-поиска, не публикуется в клиентском коде |

## Как добавить в Vercel Dashboard

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **surgical-research-platform-mvp**
3. Перейдите в **Settings** → **Environment Variables**
4. Для каждой переменной:
   - Нажмите **Add New**
   - Введите **Key** (например `NEXT_PUBLIC_SITE_URL`)
   - Введите **Value** (например `https://proffssv.site`)
   - Выберите среды: ✅ Production, ✅ Preview, ✅ Development
   - Нажмите **Save**
5. После добавления всех переменных → **Deployments** → **Redeploy** последний деплой

> **Важно:** Переменные с префиксом `NEXT_PUBLIC_` доступны в клиентском коде.
> Переменные без этого префикса доступны только на сервере.

## Полный список переменных

```env
# SEO (обязательно для корректных мета-тегов)
NEXT_PUBLIC_SITE_URL=https://proffssv.site
NEXT_PUBLIC_CONTACT_EMAIL=contact@proffssv.site
# NEXT_PUBLIC_TWITTER_HANDLE=@your_account

# NextAuth.js
NEXTAUTH_SECRET=<ваш-секретный-ключ>
NEXTAUTH_URL=https://proffssv.site

# База данных
DATABASE_URL=postgresql://user:password@host:5432/surgical_platform?schema=public

# Приложение
NEXT_PUBLIC_APP_URL=https://proffssv.site
ABACUSAI_API_KEY=<ваш-abacusai-api-key>
NODE_ENV=production
```

## После деплоя

Один раз запустите скрипт исправления опубликованного контента, чтобы курс с пустым slug получил корректный URL:

```bash
npm run fix:content
```

## Проверка после настройки

После redeploy проверьте:

```bash
# 1. Sitemap
curl -s https://proffssv.site/sitemap.xml | head -20

# 2. Robots.txt
curl -s https://proffssv.site/robots.txt

# 3. OG-теги (должны содержать proffssv.site, а не vercel.app)
curl -s https://proffssv.site/journal/antibiotikoterapiya-v-khirurgii-ratsionalnyy-vybor-na-osnove \
  | grep -oP '<meta property="og:[^"]*" content="[^"]*"' | head -5

# 4. JSON-LD
curl -s https://proffssv.site/journal/antibiotikoterapiya-v-khirurgii-ratsionalnyy-vybor-na-osnove \
  | grep -oP '<script type="application/ld\+json">.*?</script>' | python3 -m json.tool
```
