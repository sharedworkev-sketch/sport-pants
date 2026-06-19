"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faq } from "@/data/faq";
import { Reveal } from "./Reveal";
import { CtaButton } from "./CtaButton";

/** Закрытие возражений — снимает страхи холодного трафика. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white px-4 py-14">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Почему стоит заказать сейчас
          </h2>
          <p className="mt-3 text-center text-ink-soft">
            Никаких рисков: платишь только при получении.
          </p>
        </Reveal>

        <div className="mt-8 space-y-3">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.03}>
                <div className="overflow-hidden rounded-2xl bg-canvas ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-bold text-ink">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-lg font-bold leading-none text-white"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <CtaButton source="faq">Оставить заявку</CtaButton>
        </div>
      </div>
    </section>
  );
}
