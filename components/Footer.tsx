import { content } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white px-4 py-10 pb-24 md:pb-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="font-display text-lg font-extrabold text-ink">{content.brand}</div>
          <p className="mt-1 text-sm text-ink-muted">{content.footer.note}</p>
        </div>
        <div className="text-sm text-ink-soft">
          <a href={`tel:${content.footer.phone.replace(/\s|\(|\)|-/g, "")}`} className="block font-semibold hover:text-accent">
            {content.footer.phone}
          </a>
          <a href={`mailto:${content.footer.email}`} className="block hover:text-accent">
            {content.footer.email}
          </a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-ink-muted sm:text-left">
        © {new Date().getFullYear()} {content.brand}. {content.geo}.
      </p>
    </footer>
  );
}
