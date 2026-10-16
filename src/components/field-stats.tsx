import { useEffect, useRef, useState } from "react";
import type { FieldStat } from "@/data/cms-home";
import { prefersReducedMotion } from "@/lib/gsap-client";

function parseValue(raw: string) {
  const m = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m) return { prefix: "", num: NaN, suffix: raw, decimals: 0 };
  return { prefix: m[1] ?? "", num: Number(m[2].replace(/,/g, "")), suffix: m[3] ?? "", decimals: 0 };
}

function format(n: number, commas: boolean) {
  const rounded = Math.round(n);
  return commas ? rounded.toLocaleString("en-IN") : String(rounded);
}

function StatCell({ stat, play }: { stat: FieldStat; play: boolean }) {
  const parsed = parseValue(stat.value);
  const [shown, setShown] = useState(play && Number.isFinite(parsed.num) ? 0 : parsed.num);
  const commas = (parsed.num >= 1000 && stat.value.includes(",")) || /km/i.test(stat.value);

  useEffect(() => {
    if (!Number.isFinite(parsed.num)) return;
    if (!play || prefersReducedMotion()) {
      setShown(parsed.num);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(parsed.num * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, parsed.num]);

  const display = Number.isFinite(parsed.num)
    ? `${parsed.prefix}${format(shown, commas)}${parsed.suffix}`
    : stat.value;

  return (
    <li className="border-border px-4 py-3 even:border-l sm:min-w-[9.5rem] md:flex-1 md:border-l md:px-8 md:py-0 md:first:border-l-0 md:first:pl-0 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0">
      <p className="font-display text-[clamp(1.85rem,6vw,3rem)] leading-none text-fg tabular-nums">{display}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-muted">{stat.label}</p>
    </li>
  );
}

export function FieldStats({ stats }: { stats: FieldStat[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!stats.length) return null;

  return (
    <section className="border-y border-border">
      <ul
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-y-2 px-4 py-10 sm:px-5 md:flex md:gap-0 md:px-10 md:py-14"
      >
        {stats.map((s) => (
          <StatCell key={s.label} stat={s} play={play} />
        ))}
      </ul>
    </section>
  );
}
