# Настройка переменных окружения в Vercel

## Обязательные переменные для SEO

Без этих переменных OG-теги будут указывать на `localhost` или Vercel-домен вместо `proffssv.site`.

| Переменная | Значение | Описание |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://proffssv.site` | Базовый URL сайта для canonical, OG, sitemap |

## Как добавить в Vercel Dashboard

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **surgical-research-platform-mvp**
3. Перейдите в **Settings** → **Environment Variables**
4. Нажмите **Add New**
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://proffssv.site`
   - Выберите среды: ✅ Production, ✅ Preview, ✅ Development
   - Нажмите **Save**
5. → **Deployments** → **Redeploy** последний деплой

> **Важно:** Переменные с префиксом `NEXT_PUBLIC_` доступны в клиентском коде.
> Переменные без этого префикса доступны только на сервере.

## Полный список переменных

```env
# SEO (обязательно для корректных мета-тегов)
NEXT_PUBLIC_SITE_URL=https://proffssv.site

# NextAuth.js
NEXTAUTH_SECRET=<ваш-секретный-ключ>
NEXTAUTH_URL=https://proffssv.site

# База данных
DATABASE_URL=postgresql://user:password@host:5432/surgical_platform?schema=public

# Приложение
NEXT_PUBLIC_APP_URL=https://proffssv.site
NODE_ENV=production
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
