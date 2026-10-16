import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markReady, prefersReducedMotion, whenReady } from "@/lib/ready";

let registered = false;

export function registerGsap() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger, markReady, prefersReducedMotion, whenReady };
