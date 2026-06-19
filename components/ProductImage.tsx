"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getColor } from "@/data/colors";

/**
 * ПЛЕЙСХОЛДЕР изображения товара.
 *
 * Рисует силуэт штанов, залитый выбранным цветом, чтобы лендинг выглядел
 * законченным без реальных фото. Плавно меняет цвет (Framer Motion).
 *
 * ▶ Чтобы поставить реальные фото: положи файлы в /public/products (см.
 *   поле `image` в data/colors.ts) и замени тело этого компонента на
 *   <Image src={color.image} ... /> из next/image.
 */
export function ProductImage({
  colorId,
  className = "",
}: {
  colorId: string;
  className?: string;
}) {
  const color = getColor(colorId);
  const hex = color?.hex ?? "#1A1A1F";

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(26,26,31,0.35)] ring-1 ring-black/5 ${className}`}
    >
      {/* мягкий фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas to-white" />

      <AnimatePresence mode="wait">
        <motion.div
          key={colorId}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <PantsSilhouette hex={hex} />
        </motion.div>
      </AnimatePresence>

      {/* бейдж «фото-плейсхолдер» */}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur">
        фото-плейсхолдер · {color?.name}
      </span>
    </div>
  );
}

function PantsSilhouette({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-full w-auto drop-shadow-xl" aria-hidden>
      <defs>
        <linearGradient id={`g-${hex}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={hex} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* пояс */}
      <rect x="48" y="12" width="104" height="22" rx="10" fill={hex} />
      {/* основная форма штанов */}
      <path
        d="M50 30 h100 c4 0 7 3 7 7 l-12 200 c-1 8 -8 11 -16 11 h-20 c-7 0 -11 -3 -12 -10 l-7 -120 -7 120 c-1 7 -5 10 -12 10 h-20 c-8 0 -15 -3 -16 -11 l-12 -200 c0 -4 3 -7 7 -7 Z"
        fill={`url(#g-${hex})`}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
      />
      {/* боковые лампасы */}
      <rect x="55" y="40" width="4" height="190" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="141" y="40" width="4" height="190" rx="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
