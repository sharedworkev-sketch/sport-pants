"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { leadSchema } from "@/lib/validation";
import { content } from "@/data/content";
import { colors } from "@/data/colors";
import { sizes } from "@/data/sizes";
import { useStore } from "@/store/useStore";
import { readLeadMeta } from "@/lib/utm";
import { track } from "@/lib/analytics";
import { PriceTag } from "./PriceTag";
import { Reveal } from "./Reveal";

type FormValues = {
  name: string;
  phone: string;
  color: string;
  size: string;
  company?: string; // honeypot
};

export function LeadForm() {
  const selectedColor = useStore((s) => s.selectedColor);
  const selectedSize = useStore((s) => s.selectedSize);
  const setColor = useStore((s) => s.setColor);
  const setSize = useStore((s) => s.setSize);
  const status = useStore((s) => s.status);
  const setStatus = useStore((s) => s.setStatus);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "+375",
      color: selectedColor,
      size: selectedSize,
      company: "",
    },
  });

  // Синхронизация выбора цвета/размера из стора (Hero/витрина) -> поля формы.
  useEffect(() => {
    setValue("color", selectedColor, { shouldValidate: false });
  }, [selectedColor, setValue]);
  useEffect(() => {
    setValue("size", selectedSize, { shouldValidate: false });
  }, [selectedSize, setValue]);

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, meta: readLeadMeta() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus("success");
      // Ключевая конверсия для TikTok
      track("SubmitForm", { color: data.color, size: data.size });
      track("CompleteRegistration", {
        content_type: "product",
        value: content.price,
        currency: "BYN",
      });
    } catch (err) {
      console.error("Lead submit failed:", err);
      setStatus("error");
    }
  };

  return (
    <section id="lead-form" className="scroll-mt-20 bg-gradient-to-b from-canvas to-accent-soft/40 px-4 py-14">
      <div className="mx-auto max-w-xl">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(59,91,255,0.45)] ring-1 ring-black/5">
            {/* шапка-оффер */}
            <div className="border-b border-black/5 bg-accent px-6 py-6 text-center text-white sm:px-8">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                {content.form.title}
              </h2>
              <p className="mt-2 text-sm text-white/85">{content.form.subtitle}</p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-ink">
                <PriceTag size="sm" />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6 text-center"
                  >
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-4xl">
                      ✅
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">
                      {content.form.successTitle}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-ink-soft">
                      {content.form.successText}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-6 text-sm font-bold text-accent underline-offset-4 hover:underline"
                    >
                      Оформить ещё одну заявку
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    {/* honeypot — скрыто от людей */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                      {...register("company")}
                    />

                    {/* Имя */}
                    <Field label="Имя" error={errors.name?.message}>
                      <input
                        type="text"
                        inputMode="text"
                        autoComplete="name"
                        placeholder="Как тебя зовут?"
                        className={inputCls(!!errors.name)}
                        {...register("name")}
                      />
                    </Field>

                    {/* Телефон */}
                    <Field
                      label="Телефон"
                      error={errors.phone?.message}
                      hint="Формат: +375 29 123-45-67"
                    >
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+375 (29) 123-45-67"
                        className={inputCls(!!errors.phone)}
                        {...register("phone")}
                      />
                    </Field>

                    {/* Цвет — визуальные свотчи */}
                    <Field label="Цвет" error={errors.color?.message}>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((c) => {
                          const active = c.id === selectedColor;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setColor(c.id)}
                              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors ${
                                active
                                  ? "border-accent bg-accent-soft text-accent-700"
                                  : "border-black/10 text-ink-soft hover:border-accent/40"
                              }`}
                            >
                              <span
                                className="h-5 w-5 rounded-full ring-1 ring-black/10"
                                style={{ backgroundColor: c.hex }}
                              />
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                      <input type="hidden" {...register("color")} />
                    </Field>

                    {/* Размер */}
                    <Field label="Размер" error={errors.size?.message}>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSize(e.target.value)}
                        className={inputCls(!!errors.size)}
                      >
                        {sizes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <input type="hidden" {...register("size")} />
                    </Field>

                    {status === "error" && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                        {content.form.errorText}
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === "submitting"}
                      whileTap={{ scale: 0.97 }}
                      className="cta-glow flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-base font-extrabold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-accent-600 active:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "submitting" ? (
                        <>
                          <Spinner />
                          {content.form.submitting}
                        </>
                      ) : (
                        content.form.submit
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-ink-muted">
                      🔒 Перезвоним только по заказу. Без спама. Оплата при получении.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-bold text-ink">
        {label}
        {hint && !error && <span className="text-xs font-medium text-ink-muted">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(hasError: boolean) {
  return `w-full min-h-[52px] rounded-xl border-2 bg-canvas px-4 text-base text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent focus:bg-white ${
    hasError ? "border-red-400" : "border-black/10"
  }`;
}

function Spinner() {
  return (
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
