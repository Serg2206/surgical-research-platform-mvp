# ⚡ DNS Quick Checklist — proffssv.site

> Стримлайнд-чеклист для быстрой настройки DNS. Подробности — в `DNS_SETUP_INSTRUCTIONS.md`.

---

## 1. Скриншот текущей DNS-зоны (для отката)

Перед любыми изменениями сделайте скриншот текущих записей у регистратора.

## 2. Vercel: добавить домены

```
Vercel Dashboard → Settings → Domains → Add:
  proffssv.site
  www.proffssv.site
```

## 3. Регистратор: создать записи

```
A     @     → 76.76.21.21           TTL: 300
CNAME www   → cname.vercel-dns.com  TTL: 300
```

> Если есть старые A/CNAME для `@` или `www` — удалить перед добавлением.

## 4. Проверка DNS

```bash
# Скрипт из корня репо:
./check_dns.sh

# Или вручную:
dig proffssv.site +short          # → 76.76.21.21
dig www.proffssv.site +short      # → cname.vercel-dns.com.
nslookup proffssv.site
```

## 5. Онлайн-проверка

- https://www.whatsmydns.net/#A/proffssv.site
- https://dnschecker.org/#A/proffssv.site

## 6. SSL

Vercel выпустит сертификат автоматически (1–5 мин после DNS-пропагации).

## 7. Финальная проверка

```bash
curl -sI https://proffssv.site | head -5
curl -sI https://www.proffssv.site | head -5
```

---

## Частые ошибки

| Симптом | Решение |
|---------|---------|
| DNS не резолвится | Ждать 5–15 мин (до 48 ч) |
| ERR_TOO_MANY_REDIRECTS | Отключить прокси Cloudflare |
| 404 при корректных записях | Проверить форвардинг/редирект в панели ADM.tools |
| «Domain already in use» | Отвязать домен от другого Vercel-проекта |

---

> ✅ Готово? Проверьте `https://proffssv.site` в браузере — должен быть зелёный замок.
