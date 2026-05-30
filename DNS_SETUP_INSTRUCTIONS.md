# 🌐 DNS Setup Instructions — proffssv.site

> Пошаговая инструкция по привязке домена `proffssv.site` к Vercel-деплою.

---

## 1. Настройка в Vercel

### 1.1 Добавить домен в проект
1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **surgical-research-platform-mvp**
3. Перейдите в **Settings → Domains**
4. Нажмите **Add Domain**
5. Введите `proffssv.site` → **Add**
6. Также добавьте `www.proffssv.site` → **Add**

### 1.2 Скопировать DNS-значения
Vercel покажет необходимые DNS-записи:
- **A-запись** для `proffssv.site` → `76.76.21.21`
- **CNAME** для `www.proffssv.site` → `cname.vercel-dns.com`

---

## 2. Настройка у регистратора домена

### 2.1 Войти в панель управления DNS
Откройте панель вашего регистратора (например, Namecheap, GoDaddy, Cloudflare и т.д.)

### 2.2 Создать DNS-записи

| Тип | Имя (Host) | Значение (Value) | TTL |
|-----|-----------|------------------|-----|
| **A** | `@` (или пусто) | `76.76.21.21` | 300 (или Auto) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 300 (или Auto) |

> ⚠️ **Важно:** Если у регистратора уже есть записи типа A или CNAME для `@` или `www`, удалите их перед добавлением новых.

### 2.3 Дополнительно (рекомендуется)
Если Vercel требует верификацию через TXT-запись:

| Тип | Имя (Host) | Значение (Value) | TTL |
|-----|-----------|------------------|-----|
| **TXT** | `_vercel` | *(значение из Vercel Dashboard)* | 300 |

---

## 3. Проверка

### 3.1 Автоматическая проверка
```bash
# Из корня проекта:
./check_dns.sh
```

### 3.2 Ручная проверка
```bash
# A-запись
dig proffssv.site +short
# Ожидаемый результат: 76.76.21.21

# CNAME для www
dig www.proffssv.site +short
# Ожидаемый результат: cname.vercel-dns.com.

# nslookup
nslookup proffssv.site
```

### 3.3 Онлайн-проверка
- [whatsmydns.net](https://www.whatsmydns.net/#A/proffssv.site) — глобальная DNS-пропагация
- [dnschecker.org](https://dnschecker.org/#A/proffssv.site) — альтернатива

---

## 4. SSL-сертификат

Vercel **автоматически** выпускает SSL-сертификат (Let's Encrypt) после успешной DNS-верификации.

- Статус SSL можно проверить в **Vercel → Settings → Domains**
- Обычно сертификат выдаётся в течение 1–5 минут после DNS-пропагации

---

## 5. Чеклист

- [ ] Домен `proffssv.site` добавлен в Vercel
- [ ] Домен `www.proffssv.site` добавлен в Vercel
- [ ] A-запись `@` → `76.76.21.21` создана у регистратора
- [ ] CNAME `www` → `cname.vercel-dns.com` создана у регистратора
- [ ] TXT-верификация (если требуется) выполнена
- [ ] `./check_dns.sh` показывает правильные значения
- [ ] SSL-сертификат выпущен (зелёный замок в браузере)
- [ ] Сайт открывается по `https://proffssv.site`
- [ ] Сайт открывается по `https://www.proffssv.site`
- [ ] Редирект www → корневой домен работает (или наоборот)

---

## 6. Troubleshooting

| Проблема | Решение |
|----------|---------|
| DNS не распространился | Подождите 5–15 минут (иногда до 48 часов) |
| SSL не выпускается | Проверьте, что DNS-записи корректны через `check_dns.sh` |
| ERR_TOO_MANY_REDIRECTS | Отключите прокси Cloudflare (серая иконка) если используется |
| 404 на домене | Убедитесь, что в Vercel выбран правильный проект |
| «Domain already in use» | Домен привязан к другому проекту Vercel — отвяжите сначала |

---

## Информация о домене

| Параметр | Значение |
|----------|---------|
| Домен | proffssv.site |
| Оплачен до | 21.10.2026 |
| Vercel-проект | surgical-research-platform-mvp |
| GitHub-репо | Serg2206/surgical-research-platform-mvp |

---

> 📌 После успешной настройки DNS удалите этот файл или переместите в `/docs`.
