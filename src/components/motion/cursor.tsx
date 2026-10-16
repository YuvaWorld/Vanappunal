import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap-client";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current;
    const m = mark.current;
    if (!d || !m) return;
    let x = 0;
    let y = 0;
    let mx = 0;
    let my = 0;
    let hover = false;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      hover = Boolean(t?.closest("a, button, [data-cursor], .journey-rail"));
    };
    const loop = () => {
      mx += (x - mx) * 0.22;
      my += (y - my) * 0.22;
      m.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      m.classList.toggle("is-hot", hover);
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={mark} className="cursor-reticle" aria-hidden>
        <svg viewBox="0 0 32 32" width="32" height="32">
          <line x1="16" y1="1" x2="16" y2="10" />
          <line x1="16" y1="22" x2="16" y2="31" />
          <line x1="1" y1="16" x2="10" y2="16" />
          <line x1="22" y1="16" x2="31" y2="16" />
          <circle className="cursor-circle" cx="16" cy="16" r="5" />
          <polygon className="cursor-tri" points="16,9.5 22.5,21.5 9.5,21.5" />
        </svg>
      </div>
    </>
  );
}
