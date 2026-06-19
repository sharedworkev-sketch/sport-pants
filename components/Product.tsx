"use client";

import { useStore } from "@/store/useStore";
import { benefits } from "@/data/benefits";
import { content } from "@/data/content";
import { ProductImage } from "./ProductImage";
import { Reveal } from "./Reveal";
import { CtaButton } from "./CtaButton";

const icons: Record<string, string> = {
  move: "🤸",
  fabric: "🧵",
  fit: "📐",
  shape: "💪",
  gym: "🏋️",
  pocket: "📱",
};

/** Презентация товара через выгоды (а не характеристики). */
export function Product() {
  const selectedColor = useStore((s) => s.selectedColor);

  return (
    <section id="product" className="bg-white px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Почему их хочется носить каждый день
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              Это не просто штаны. Это комфорт, который ты чувствуешь с первой минуты — и в зале,
              и на улице.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="lg:sticky lg:top-24">
            <div className="mx-auto w-full max-w-sm">
              <ProductImage colorId={selectedColor} />
              <div className="mt-5 hidden lg:block">
                <CtaButton source="product" fullWidth>
                  {content.finalCta.cta}
                </CtaButton>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl bg-canvas p-5 ring-1 ring-black/5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-2xl">
                    <span aria-hidden>{icons[b.icon] ?? "✅"}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center lg:hidden">
          <CtaButton source="product">{content.finalCta.cta}</CtaButton>
        </div>
      </div>
    </section>
  );
}
