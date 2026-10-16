import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/gsap-client";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __averuneSeek?: (progress: number) => void;
    __averuneScrub?: (on: boolean) => void;
  }
}

function emitProgress(scroll: number, limit: number) {
  const progress = limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0;
  window.dispatchEvent(new CustomEvent("nl-scroll", { detail: { progress } }));
}

function nativeLimit() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) {
      const onWin = () => emitProgress(window.scrollY, nativeLimit());
      window.__averuneSeek = (p) => {
        window.scrollTo(0, Math.min(1, Math.max(0, p)) * nativeLimit());
      };
      window.__averuneScrub = () => {};
      onWin();
      window.addEventListener("scroll", onWin, { passive: true });
      return () => {
        window.removeEventListener("scroll", onWin);
        delete window.__averuneSeek;
        delete window.__averuneScrub;
      };
    }
    registerGsap();
    const lenis = new Lenis({
      duration: 0.38,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      prevent: (node) => node.closest(".journey-rail") !== null,
    });
    lenis.on("scroll", (e: { scroll: number; limit: number }) => {
      ScrollTrigger.update();
      emitProgress(e.scroll, e.limit);
    });
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.__averuneSeek = (p) => {
      const t = Math.min(1, Math.max(0, p));
      const y = t * Math.max(nativeLimit(), lenis.limit);
      lenis.scrollTo(y, { immediate: true, force: true, programmatic: true });
      window.scrollTo(0, y);
    };
    window.__averuneScrub = (on) => {
      if (on) lenis.stop();
      else lenis.start();
    };

    emitProgress(0, 1);
    return () => {
      delete window.__averuneSeek;
      delete window.__averuneScrub;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    emitProgress(0, 1);
  }, [pathname]);

  return null;
}
