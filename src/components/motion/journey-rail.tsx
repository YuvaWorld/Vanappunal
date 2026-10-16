import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap-client";

function progressAt(rail: HTMLElement, clientY: number) {
  const rect = rail.getBoundingClientRect();
  const thumb = 44;
  const t = (clientY - rect.top - thumb / 2) / Math.max(1, rect.height - thumb);
  return Math.min(1, Math.max(0, t));
}

export function JourneyRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [walking, setWalking] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    setWalking(!prefersReducedMotion());
    let idle = 0;
    const onScroll = (e: Event) => {
      if (dragging.current) return;
      const p = (e as CustomEvent<{ progress: number }>).detail?.progress ?? 0;
      setProgress(p);
      setVisible(p > 0.015 && p < 0.995);
      setWalking(!prefersReducedMotion());
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setWalking(false), 180);
    };
    const onWin = () => {
      if (dragging.current) return;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const p = limit > 0 ? window.scrollY / limit : 0;
      setProgress(p);
      setVisible(p > 0.015 && p < 0.995);
    };
    window.addEventListener("nl-scroll", onScroll);
    window.addEventListener("scroll", onWin, { passive: true });
    return () => {
      window.removeEventListener("nl-scroll", onScroll);
      window.removeEventListener("scroll", onWin);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const apply = (clientY: number) => {
      const p = progressAt(rail, clientY);
      setProgress(p);
      setVisible(true);
      setWalking(true);
      window.__averuneSeek?.(p);
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging.current = true;
      setHeld(true);
      document.documentElement.classList.add("is-scrubbing");
      window.__averuneScrub?.(true);
      rail.setPointerCapture(e.pointerId);
      apply(e.clientY);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      apply(e.clientY);
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      setHeld(false);
      setWalking(false);
      document.documentElement.classList.remove("is-scrubbing");
      window.__averuneScrub?.(false);
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
    };

    rail.addEventListener("pointerdown", onDown, { passive: false });
    rail.addEventListener("pointermove", onMove, { passive: false });
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", onUp);
    rail.addEventListener("lostpointercapture", onUp);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointercancel", onUp);
      rail.removeEventListener("lostpointercapture", onUp);
    };
  }, []);

  return (
    <div
      ref={railRef}
      className="journey-rail"
      data-lenis-prevent
      data-lenis-prevent-touch
      role="scrollbar"
      aria-label="Page scroll"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className={walking || held ? "journey-thumb is-walk" : "journey-thumb"}
        style={{
          top: `calc(4px + ${progress} * (100% - 48px))`,
          opacity: visible || held ? 1 : 0.55,
        }}
      >
        <img src="/images/walker.png" alt="" width={22} height={48} draggable={false} />
      </div>
    </div>
  );
}
