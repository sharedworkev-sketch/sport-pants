"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { scrollToForm } from "@/store/useStore";
import { track } from "@/lib/analytics";

type Props = {
  children: ReactNode;
  /** Метка кнопки для аналитики (какой CTA нажали) */
  source: string;
  className?: string;
  glow?: boolean;
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-accent-600 active:bg-accent-700 min-h-[52px] select-none";

/**
 * Главная CTA-кнопка: пульсирует, скроллит к форме, шлёт ClickButton.
 * Все призывы к действию на странице ведут сюда.
 */
export function CtaButton({ children, source, className = "", glow = true, fullWidth }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        track("ClickButton", { source });
        scrollToForm();
      }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${glow ? "cta-glow" : ""} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}
