export function markReady() {
  if (typeof window === "undefined") return;
  window.__averuneReady = true;
  try {
    sessionStorage.setItem("averune.booted", "1");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event("averune:ready"));
}

export function whenReady(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__averuneReady) {
    fn();
    return () => {};
  }
  window.addEventListener("averune:ready", fn, { once: true });
  return () => window.removeEventListener("averune:ready", fn);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

declare global {
  interface Window {
    __averuneReady?: boolean;
    __averuneBoot?: number;
    __averuneHeadDone?: boolean;
  }
}
