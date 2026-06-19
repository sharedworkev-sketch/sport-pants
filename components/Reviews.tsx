"use client";

import { reviews } from "@/data/reviews";
import { content } from "@/data/content";
import { Reveal } from "./Reveal";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-flame" aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < n ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

/** Социальное доказательство. Отзывы-заглушки — заменить реальными. */
export function Reviews() {
  return (
    <section id="reviews" className="px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Что говорят покупатели
            </h2>
            <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-black/5">
              <span className="font-display text-2xl font-extrabold text-ink">
                ★ {content.rating.toLocaleString("ru-RU")}
              </span>
              <span className="text-sm font-semibold text-ink-soft">
                более {content.happyCustomers.toLocaleString("ru-RU")} довольных покупателей
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name + i} delay={(i % 3) * 0.06}>
              <figure className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft font-bold text-accent-700">
                    {initials(r.name)}
                  </div>
                  <div>
                    <figcaption className="font-bold text-ink">{r.name}</figcaption>
                    <p className="text-xs text-ink-muted">{r.city}</p>
                  </div>
                </div>
                <Stars n={r.rating} />
                <blockquote className="mt-2 text-sm leading-relaxed text-ink-soft">
                  «{r.text}»
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          * Отзывы-плейсхолдеры. Замените реальными перед запуском рекламы.
        </p>
      </div>
    </section>
  );
}
