"use client";

import { content } from "@/data/content";
import { Reveal } from "./Reveal";

/** Лёгкое давление: остаток и заказы за сегодня (цифры в data/content.ts). */
export function Scarcity() {
  return (
    <Reveal>
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-center shadow-sm ring-1 ring-black/5 sm:flex-row sm:gap-8">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame/70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flame" />
            </span>
            По акции осталось:{" "}
            <span className="text-flame">{content.unitsLeft} шт.</span>
          </span>
          <span className="hidden h-5 w-px bg-black/10 sm:block" />
          <span className="text-sm font-semibold text-ink-soft">
            🔥 Сегодня уже заказали{" "}
            <span className="font-bold text-ink">{content.orderedToday}</span> человек
          </span>
        </div>
      </div>
    </Reveal>
  );
}
