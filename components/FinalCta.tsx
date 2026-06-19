"use client";

import { content } from "@/data/content";
import { PriceTag } from "./PriceTag";
import { CtaButton } from "./CtaButton";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="px-4 py-16">
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-accent px-6 py-12 text-center text-white shadow-xl sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-flame/20 blur-2xl" />

          <h2 className="relative font-display text-3xl font-extrabold sm:text-4xl">
            {content.finalCta.title}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">
            {content.finalCta.subtitle}
          </p>

          <div className="relative mt-6 flex justify-center">
            <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-ink">
              <PriceTag size="sm" />
            </div>
          </div>

          <div className="relative mt-7 flex justify-center">
            <CtaButton source="final" glow={false} className="bg-ink hover:bg-black active:bg-black">
              {content.finalCta.cta}
            </CtaButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
