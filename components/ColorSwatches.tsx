"use client";

import { motion } from "framer-motion";
import { colors } from "@/data/colors";
import { useStore } from "@/store/useStore";

/**
 * Селектор 4 цветов. Завязан на Zustand, поэтому выбор синхронизирован
 * между Hero, витриной цветов и формой заявки.
 */
export function ColorSwatches({
  size = "md",
  showName = true,
}: {
  size?: "md" | "lg";
  showName?: boolean;
}) {
  const selectedColor = useStore((s) => s.selectedColor);
  const setColor = useStore((s) => s.setColor);

  const dot = size === "lg" ? "h-12 w-12" : "h-9 w-9";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-3">
        {colors.map((c) => {
          const active = c.id === selectedColor;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.id)}
              aria-pressed={active}
              aria-label={c.name}
              title={c.name}
              className="relative grid place-items-center rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {active && (
                <motion.span
                  layoutId="swatch-ring"
                  className="absolute inset-0 rounded-full ring-2 ring-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span
                className={`${dot} rounded-full ring-1 ring-black/10 transition-transform ${active ? "scale-105" : "hover:scale-105"}`}
                style={{ backgroundColor: c.hex }}
              />
            </button>
          );
        })}
      </div>
      {showName && (
        <span className="text-sm font-semibold text-ink-soft">
          Цвет: {colors.find((c) => c.id === selectedColor)?.name}
        </span>
      )}
    </div>
  );
}
