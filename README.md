# FLEXFIT — лендинг «Спортивные штаны»

Продающий одностраничник под трафик из TikTok (99% мобильных). Цель — заявка.
Заявки уходят в **Google Sheets** через серверный Service Account.

**Стек:** Next.js 16 (App Router, TS) · Tailwind CSS v4 · Framer Motion · Zustand ·
react-hook-form + zod · googleapis · TikTok Pixel.

---

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # затем заполнить значения (см. ниже)
npm run dev
```

Открыть http://localhost:3000

> Сайт запустится и без `.env` — будет работать всё, кроме записи в таблицу
> (форма вернёт ошибку отправки) и TikTok-пикселя.

---

## Где что править (без лезания в разметку)

Все тексты, цены, цвета, размеры, отзывы вынесены в `/data`:

| Файл | Что меняем |
|------|------------|
| `data/content.ts` | цена/старая цена/скидка, заголовки, тексты, число клиентов, остаток |
| `data/colors.ts`  | **4 цвета** (название, hex, путь к фото) |
| `data/sizes.ts`   | размерная сетка |
| `data/reviews.ts` | отзывы (сейчас заглушки — заменить реальными) |
| `data/faq.ts`     | вопросы-ответы (закрытие возражений) |
| `data/benefits.ts`| выгоды товара |

**Реальные фото товара:** положи файлы в `public/products/` (имена — поле `image`
в `data/colors.ts`) и замени тело `components/ProductImage.tsx` на `next/image`.
Сейчас там аккуратный плейсхолдер-силуэт в цвет товара.

---

## Настройка Google Sheets (Service Account)

1. Зайди в [Google Cloud Console](https://console.cloud.google.com/) → создай проект.
2. **APIs & Services → Library** → включи **Google Sheets API**.
3. **APIs & Services → Credentials → Create credentials → Service account**.
   Дай имя, создай. Роли можно не назначать.
4. Открой созданный сервис-аккаунт → вкладка **Keys → Add key → Create new key → JSON**.
   Скачается JSON-файл с `client_email` и `private_key`.
5. Создай Google-таблицу. Переименуй первый лист в **`Заявки`** (или поменяй
   `GOOGLE_SHEET_RANGE`). Желательно вписать в первую строку заголовки:
   `Дата/время | Имя | Телефон | Цвет | Размер | utm_source | utm_medium | utm_campaign | utm_content | ttclid | referrer`
6. **Расшарь таблицу** на email сервис-аккаунта (`client_email`, вида
   `...@...iam.gserviceaccount.com`) с правами **Редактор**. Без этого записи не будет!
7. ID таблицы — из URL: `docs.google.com/spreadsheets/d/`**`<ID>`**`/edit`.

### Заполнение `.env.local`

```
GOOGLE_CLIENT_EMAIL=имя@проект.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbC...XYZ
GOOGLE_SHEET_RANGE=Заявки!A:K
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXXXXX
```

- `GOOGLE_PRIVATE_KEY` — скопируй из JSON как есть (с `\n`), оберни в кавычки.
  В коде переносы восстанавливаются `.replace(/\\n/g, "\n")`.

---

## TikTok Pixel

- ID — в `NEXT_PUBLIC_TIKTOK_PIXEL_ID`. Если пусто — пиксель не подключается.
- События: `ViewContent` (загрузка), `ClickButton` (клики по CTA),
  `SubmitForm` + `CompleteRegistration` (успешная заявка — ключевая конверсия).
- Обёртка `lib/analytics.ts` — есть заготовки под GA4 / Яндекс.Метрику.

---

## Таймер акции

Считает время до конца текущих суток по **Europe/Minsk** (UTC+3) и в полночь
автоматически стартует заново. Логика — `lib/time.ts`.

---

## Деплой на Vercel

1. Залей проект в Git-репозиторий, импортируй в [Vercel](https://vercel.com/new).
2. **Project → Settings → Environment Variables** — добавь все переменные из
   `.env.example` (для Production и Preview).
   - `GOOGLE_PRIVATE_KEY` вставляй целиком вместе с `\n` (Vercel хранит как есть).
3. Deploy. API-route `app/api/lead` работает на Node.js-runtime (уже задано).
4. Проверь: отправь тестовую заявку → строка должна появиться в таблице.

---

## Структура

```
app/
  layout.tsx            шрифты, метаданные, TikTok Pixel
  page.tsx              сборка секций
  api/lead/route.ts     приём заявки + запись в Sheets
components/             Header, Hero, Timer, Colors, Product, Reviews, FAQ,
                        LeadForm, FinalCta, Footer, StickyCta, Scarcity ...
lib/
  validation.ts         общая zod-схема (клиент + сервер)
  time.ts               отсчёт до полуночи по Минску
  sheets.ts             googleapis + append
  analytics.ts          обёртка над пикселем
  utm.ts                чтение UTM/ttclid из URL
  rate-limit.ts         in-memory лимит по IP
store/useStore.ts       zustand (цвет/размер/статус формы/ui)
data/                   content, colors, sizes, reviews, faq, benefits
```
