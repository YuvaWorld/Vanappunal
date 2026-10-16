import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion, whenReady } from "@/lib/gsap-client";

export function SplitHeading({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".split-word");
    if (prefersReducedMotion()) {
      words.forEach((w) => {
        w.style.transform = "none";
        w.style.opacity = "1";
      });
      return;
    }
    gsap.set(words, { yPercent: 0, opacity: 1 });
    const play = () => {
      if (window.__averuneHeadDone) return;
      window.__averuneHeadDone = true;
      gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.38,
          ease: "power3.out",
          stagger: 0.04,
          delay,
        },
      );
    };
    return whenReady(play);
  }, [text, delay]);

  const parts = text.split(/(\s+)/);

  return (
    <Tag ref={ref as never} className={cn("split-heading", className)}>
      {parts.map((part, i) =>
        /^\s+$/.test(part) ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="split-mask">
            <span className="split-word">{part}</span>
          </span>
        ),
      )}
    </Tag>
  );
}
