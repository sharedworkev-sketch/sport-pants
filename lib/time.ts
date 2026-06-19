/**
 * Время по часовому поясу Europe/Minsk (UTC+3, без перехода на летнее время).
 */

const MINSK_TZ = "Europe/Minsk";

type Countdown = { hours: number; minutes: number; seconds: number; total: number };

/**
 * Текущее время в Минске, разложенное на h/m/s, независимо от часового пояса
 * браузера. Считаем через Intl, чтобы не зависеть от настроек устройства.
 */
function minskTimeParts(now: Date = new Date()): { h: number; m: number; s: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: MINSK_TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  // 24:00 у некоторых движков приходит как hour=24 в полночь — нормализуем.
  const h = get("hour") % 24;
  return { h, m: get("minute"), s: get("second") };
}

/**
 * Сколько осталось до конца текущих суток по Минску (до 23:59:59 -> 00:00:00).
 * Возвращает h/m/s и общий остаток в секундах. В полночь автоматически
 * начинается новый отсчёт (≈86400 секунд).
 */
export function getCountdownToMinskMidnight(now: Date = new Date()): Countdown {
  const { h, m, s } = minskTimeParts(now);
  const elapsed = h * 3600 + m * 60 + s;
  const total = 86400 - elapsed; // секунд до полуночи
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

/** Метка времени заявки в человекочитаемом виде по Минску: "16.06.2026, 14:35:09". */
export function minskTimestamp(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: MINSK_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}

export const pad2 = (n: number): string => String(n).padStart(2, "0");
