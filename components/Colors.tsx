"use client";

import { useStore } from "@/store/useStore";
import { colors } from "@/data/colors";
import { ProductImage } from "./ProductImage";
import { ColorSwatches } from "./ColorSwatches";
import { Reveal } from "./Reveal";
import { CtaButton } from "./CtaButton";

/** Витрина 4 цветов с интерактивным селектором. */
export function Colors() {
  const selectedColor = useStore((s) => s.selectedColor);
  const setColor = useStore((s) => s.setColor);

  return (
    <section id="colors" className="px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              4 цвета — выбери свой
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              Под любой образ и настроение. Тапни по цвету — посмотри, как смотрятся.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
          <Reveal>
            <div className="mx-auto w-full max-w-sm">
              <ProductImage colorId={selectedColor} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              {/* крупные карточки-цвета */}
              <div className="grid grid-cols-2 gap-3">
                {colors.map((c) => {
                  const active = c.id === selectedColor;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition-all ${
                        active
                          ? "border-accent shadow-md"
                          : "border-transparent ring-1 ring-black/5 hover:border-accent/40"
                      }`}
                    >
                      <span
                        className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-sm font-bold text-ink">{c.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-accent-soft p-5 text-center">
                <p className="font-semibold text-accent-700">
                  Цвет из заявки мы подтверждаем по телефону — придёт ровно тот, что выбрал.
                </p>
                <div className="mt-4 flex flex-col items-center gap-4">
                  <ColorSwatches size="md" />
                  <CtaButton source="colors" fullWidth>
                    Заказать в этом цвете
                  </CtaButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
