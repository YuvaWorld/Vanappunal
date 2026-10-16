import { SplitHeading } from "@/components/motion/split-heading";

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="px-4 pb-12 pt-24 sm:px-5 md:px-10 md:pb-20 md:pt-36">
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p data-reveal="load" className="text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <SplitHeading
          as="h1"
          text={title}
          delay={0.08}
          className="font-display mt-4 max-w-4xl text-[clamp(2.1rem,7.5vw,4.5rem)] leading-[1.05] text-fg"
        />
        {lede ? (
          <p
            data-reveal="load"
            className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted md:text-lg"
          >
            {lede}
          </p>
        ) : null}
      </div>
    </header>
  );
}
