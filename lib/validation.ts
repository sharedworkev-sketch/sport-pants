import { z } from "zod";
import { colorIds } from "@/data/colors";
import { sizeIds } from "@/data/sizes";

/**
 * Единая схема валидации — используется и на клиенте (react-hook-form),
 * и на сервере (route handler). Серверу клиенту не доверяем.
 */

// Белорусский мобильный: +375 + код (25|29|33|44) + 7 цифр.
const BY_PHONE_REGEX = /^\+375(25|29|33|44)\d{7}$/;

/**
 * Приводит произвольный пользовательский ввод к каноничному виду +375XXXXXXXXX.
 * Принимает варианты: 375..., 80(29)..., +375 29 ..., с пробелами/скобками/дефисами.
 */
export function normalizeByPhone(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "");

  // 80XX... (внутренний белорусский формат) -> 375XX...
  if (digits.startsWith("80")) digits = "375" + digits.slice(2);
  // 8XX... без нуля
  else if (digits.startsWith("8") && digits.length === 10) digits = "375" + digits.slice(1);
  // уже без кода страны: 29XXXXXXX
  if (digits.length === 9 && /^(25|29|33|44)/.test(digits)) digits = "375" + digits;

  if (!digits.startsWith("375")) digits = "375" + digits.replace(/^375/, "");

  return "+" + digits;
}

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введи имя (минимум 2 буквы)")
    .max(60, "Слишком длинное имя"),

  phone: z
    .string()
    .trim()
    .transform(normalizeByPhone)
    .refine((v) => BY_PHONE_REGEX.test(v), {
      message: "Введи белорусский номер: +375 (25/29/33/44) XXX-XX-XX",
    }),

  color: z.enum(colorIds as [string, ...string[]], {
    errorMap: () => ({ message: "Выбери цвет" }),
  }),

  size: z.enum(sizeIds as [string, ...string[]], {
    errorMap: () => ({ message: "Выбери размер" }),
  }),

  // Honeypot: реальные пользователи оставляют пустым. Боты — заполняют.
  company: z.string().optional().default(""),

  // Маркетинговые данные (необязательные).
  meta: z
    .object({
      utm_source: z.string().optional().default(""),
      utm_medium: z.string().optional().default(""),
      utm_campaign: z.string().optional().default(""),
      utm_content: z.string().optional().default(""),
      ttclid: z.string().optional().default(""),
      referrer: z.string().optional().default(""),
      userAgent: z.string().optional().default(""),
    })
    .optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
