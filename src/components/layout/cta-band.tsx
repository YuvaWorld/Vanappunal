import { ArrowLink } from "@/components/arrow-link";
import { SplitHeading } from "@/components/motion/split-heading";

export function CtaBand({
  eyebrow = "Atlas",
  title = "Open the map.",
  lede = "Every pin is a place walked.",
  to = "/map",
  cta = "Interactive map",
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  to?: string;
  cta?: string;
}) {
  return (
    <section className="border-t border-border px-4 py-16 sm:px-5 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">
          {eyebrow}
        </p>
        <SplitHeading
          as="h2"
          text={title}
          className="font-display mt-4 max-w-3xl text-[clamp(1.85rem,5.5vw,3.75rem)] leading-[1.1] text-fg"
        />
        <p data-reveal className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted md:text-lg">
          {lede}
        </p>
        <div data-reveal className="mt-10">
          <ArrowLink to={to}>{cta}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
