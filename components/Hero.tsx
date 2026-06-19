"use client";

import { motion } from "framer-motion";
import { content } from "@/data/content";
import { useStore } from "@/store/useStore";
import { ProductImage } from "./ProductImage";
import { ColorSwatches } from "./ColorSwatches";
import { PriceTag } from "./PriceTag";
import { CtaButton } from "./CtaButton";

const badgeIcons: Record<number, string> = { 0: "🚚", 1: "📏", 2: "💵", 3: "🎨" };

export function Hero() {
  const selectedColor = useStore((s) => s.selectedColor);

  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-10 sm:pt-28">
      {/* фоновое свечение акцента */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2">
        {/* Текстовая часть */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-700"
          >
            🔥 Скидка {content.discountPercent}% действует сегодня
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl"
          >
            {content.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-md text-base text-ink-soft sm:text-lg md:mx-0"
          >
            {content.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 flex flex-col items-center gap-5 md:items-start"
          >
            <PriceTag size="lg" />
            <CtaButton source="hero" className="w-full sm:w-auto">
              {content.hero.cta}
            </CtaButton>
          </motion.div>

          {/* Триггеры доверия */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {content.trustBadges.map((b, i) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-sm ring-1 ring-black/5"
              >
                <span aria-hidden>{badgeIcons[i]}</span>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Картинка + свотчи */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-1 mx-auto w-full max-w-sm md:order-2"
        >
          <ProductImage colorId={selectedColor} />
          <div className="mt-5">
            <ColorSwatches size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
