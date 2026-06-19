"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { content } from "@/data/content";
import { useStore, scrollToForm } from "@/store/useStore";
import { track } from "@/lib/analytics";

const navLinks = [
  { href: "#product", label: "Товар" },
  { href: "#colors", label: "Цвета" },
  { href: "#reviews", label: "Отзывы" },
];

/** Фиксированный хедер, уплотняется при скролле. */
export function Header() {
  const scrolled = useStore((s) => s.scrolled);
  const setScrolled = useStore((s) => s.setScrolled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setScrolled]);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.9)" : "rgba(247,248,250,0)",
        boxShadow: scrolled ? "0 6px 24px -16px rgba(26,26,31,0.5)" : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <a href="#top" className="flex items-baseline gap-1.5">
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            {content.brand}
          </span>
          <span className="hidden text-xs font-semibold text-accent sm:inline">
            {content.brandTagline}
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            track("ClickButton", { source: "header" });
            scrollToForm();
          }}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-accent-600 active:bg-accent-700 sm:px-5"
        >
          Заказать
        </button>
      </div>
    </motion.header>
  );
}
