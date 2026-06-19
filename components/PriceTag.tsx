import { content } from "@/data/content";

const fmt = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Блок цены: новая крупно, старая зачёркнута, бейдж −50%. */
export function PriceTag({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const priceCls =
    size === "lg" ? "text-5xl sm:text-6xl" : size === "sm" ? "text-3xl" : "text-4xl sm:text-5xl";

  return (
    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
      <span className={`font-display font-extrabold leading-none text-ink ${priceCls}`}>
        {fmt(content.price)}
        <span className="ml-1 text-xl font-bold text-ink-soft">{content.currency}</span>
      </span>
      <span className="text-xl font-semibold text-ink-muted line-through decoration-flame/80 decoration-2">
        {fmt(content.oldPrice)} {content.currency}
      </span>
      <span className="rounded-lg bg-flame px-2.5 py-1 text-sm font-extrabold text-white shadow-sm">
        −{content.discountPercent}%
      </span>
    </div>
  );
}
