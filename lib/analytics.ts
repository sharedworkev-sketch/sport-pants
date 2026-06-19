/**
 * Тонкая обёртка над пикселями. Сейчас подключён TikTok Pixel.
 * Заготовки под GA4 / Яндекс.Метрику оставлены — добавь их id в .env
 * и раскомментируй вызовы внутри track().
 *
 * Если pixel id не задан — функции просто no-op, сайт не ломается.
 */

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      load: (id: string) => void;
    };
    // gtag?: (...args: unknown[]) => void;   // GA4 — заготовка
    // ym?: (...args: unknown[]) => void;     // Яндекс.Метрика — заготовка
  }
}

export type TrackEvent =
  | "ViewContent"
  | "ClickButton"
  | "SubmitForm"
  | "CompleteRegistration";

export function track(event: TrackEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  try {
    window.ttq?.track(event, params);

    // GA4 (заготовка):
    // if (process.env.NEXT_PUBLIC_GA_ID) window.gtag?.("event", event, params);

    // Яндекс.Метрика (заготовка):
    // const ym = process.env.NEXT_PUBLIC_YM_ID;
    // if (ym) window.ym?.(Number(ym), "reachGoal", event, params);
  } catch {
    // аналитика никогда не должна ломать UX
  }
}
