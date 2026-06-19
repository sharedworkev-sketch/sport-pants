"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { content } from "@/data/content";
import { getCountdownToMinskMidnight, pad2 } from "@/lib/time";
import { CtaButton } from "./CtaButton";

/**
 * Обратный отсчёт до конца текущих суток по Минску.
 * В полночь автоматически начинается новый отсчёт.
 */
export function Timer() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(
    null,
  );

  useEffect(() => {
    const tick = () => {
      const c = getCountdownToMinskMidnight();
      setTime({ hours: c.hours, minutes: c.minutes, seconds: c.seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = time
    ? [
        { v: time.hours, l: "часов" },
        { v: time.minutes, l: "минут" },
        { v: time.seconds, l: "секунд" },
      ]
    : null;

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-[#2a2a35] px-6 py-8 text-center text-white shadow-xl sm:px-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-flame">
          ⚡ {content.timer.title}
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          {content.timer.subtitle}
        </h2>

        {/* Таймер */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {units
            ? units.map((u, i) => (
                <div key={u.l} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-center">
                    <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 sm:h-20 sm:w-20">
                      <motion.span
                        key={u.v}
                        initial={{ y: -16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl"
                      >
                        {pad2(u.v)}
                      </motion.span>
                    </div>
                    <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                      {u.l}
                    </span>
                  </div>
                  {i < units.length - 1 && (
                    <span className="-mt-5 font-display text-3xl font-bold text-flame sm:text-4xl">
                      :
                    </span>
                  )}
                </div>
              ))
            : // плейсхолдер до гидрации, чтобы не прыгала вёрстка
              [0, 1, 2].map((i) => (
                <div key={i} className="h-16 w-16 rounded-2xl bg-white/10 sm:h-20 sm:w-20" />
              ))}
        </div>

        <p className="mt-6 text-base font-semibold text-white/80">{content.timer.note}</p>

        <div className="mt-5 flex justify-center">
          <CtaButton source="timer">{content.timer.cta}</CtaButton>
        </div>
      </div>
    </section>
  );
}
