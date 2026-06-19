/**
 * Простейший in-memory rate-limit по ключу (IP).
 * Достаточно для защиты формы от флуда. Для нескольких инстансов
 * (горизонтальное масштабирование) замени на Redis/Upstash.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // окно 1 минута
const MAX_REQUESTS = 8; // не больше 8 заявок с IP в минуту

export function rateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// Периодически чистим протухшие записи, чтобы Map не рос бесконечно.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, b] of buckets) if (now > b.resetAt) buckets.delete(key);
  }, WINDOW_MS).unref?.();
}
