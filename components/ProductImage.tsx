"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { getColor } from "@/data/colors";

/**
 * Изображение товара выбранного цвета.
 *
 * Берёт фото из /public/products (поле `image` в data/colors.ts) и плавно
 * перекрёстно затемняет при смене цвета (Framer Motion).
 */
export function ProductImage({
  colorId,
  className = "",
}: {
  colorId: string;
  className?: string;
}) {
  const color = getColor(colorId);

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
          className="absolute inset-0"
        >
          {color?.image ? (
            <Image
              src={color.image}
              alt={`Повседневные брюки, цвет: ${color.name}`}
              fill
              preload
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
