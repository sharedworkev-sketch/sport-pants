"use client";

import { create } from "zustand";
import { colors } from "@/data/colors";
import { sizes } from "@/data/sizes";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

type StoreState = {
  // Выбор товара (шарится между Hero, витриной цветов и формой)
  selectedColor: string;
  selectedSize: string;
  setColor: (id: string) => void;
  setSize: (id: string) => void;

  // Статус отправки формы
  status: SubmitStatus;
  setStatus: (s: SubmitStatus) => void;

  // UI
  scrolled: boolean;
  setScrolled: (v: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
  selectedColor: colors[0].id,
  selectedSize: sizes[1]?.id ?? sizes[0].id, // по умолчанию M

  setColor: (id) => set({ selectedColor: id }),
  setSize: (id) => set({ selectedSize: id }),

  status: "idle",
  setStatus: (status) => set({ status }),

  scrolled: false,
  setScrolled: (scrolled) => set({ scrolled }),
}));

/** Плавный скролл к форме заявки. Используется всеми CTA. */
export function scrollToForm(): void {
  if (typeof document === "undefined") return;
  document.getElementById("lead-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
