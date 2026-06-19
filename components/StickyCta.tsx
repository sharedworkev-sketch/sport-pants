"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "@/data/content";
import { useStore, scrollToForm } from "@/store/useStore";
import { track } from "@/lib/analytics";

const fmt = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 2 });

/**
 * Прилипшая кнопка «Заказать» внизу экрана на мобильном.
 * Прячется, когда форма заявки в зоне видимости (чтобы не дублировать),
 * до первого скролла и после успешной отправки.
 */
export function StickyCta() {
  const status = useStore((s) => s.status);
  const scrolled = useStore((s) => s.scrolled);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("lead-form");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const show = scrolled && !formVisible && status !== "success";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        >
          <div className="m-3 flex items-center justify-between gap-3 rounded-2xl bg-white/95 p-2.5 pl-4 shadow-[0_-8px_30px_-12px_rgba(26,26,31,0.4)] ring-1 ring-black/5 backdrop-blur">
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold text-ink">
                {fmt(content.price)} {content.currency}
              </div>
              <div className="text-[11px] font-semibold text-ink-muted line-through">
                {fmt(content.oldPrice)} {content.currency}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                track("ClickButton", { source: "sticky" });
                scrollToForm();
              }}
              className="cta-glow flex-1 rounded-xl bg-accent px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white active:bg-accent-700"
            >
              Заказать
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
