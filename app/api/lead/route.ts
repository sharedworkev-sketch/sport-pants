import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { appendLead } from "@/lib/sheets";
import { minskTimestamp } from "@/lib/time";
import { rateLimit } from "@/lib/rate-limit";

// Запись в Google Sheets требует Node.js runtime (не Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // 1. Rate-limit по IP
  const ip = clientIp(req);
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // 2. Парсинг тела
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 3. Серверная валидация (клиенту не доверяем)
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 4. Honeypot: поле company должно быть пустым у реального пользователя.
  // Притворяемся, что всё ок, но ничего не пишем.
  if (data.company && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 5. Запись в Google Sheets
  const meta = data.meta ?? {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    ttclid: "",
    referrer: "",
    userAgent: "",
  };

  try {
    await appendLead({
      timestamp: minskTimestamp(),
      name: data.name,
      phone: data.phone,
      color: data.color,
      size: data.size,
      utm_source: meta.utm_source ?? "",
      utm_medium: meta.utm_medium ?? "",
      utm_campaign: meta.utm_campaign ?? "",
      utm_content: meta.utm_content ?? "",
      ttclid: meta.ttclid ?? "",
      referrer: meta.referrer ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Ошибка записи в Google Sheets:", err);
    return NextResponse.json({ ok: false, error: "sheets_error" }, { status: 502 });
  }
}
