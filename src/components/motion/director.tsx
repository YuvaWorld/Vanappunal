import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/gsap-client";

function showNow() {
  document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger] > *").forEach((el) => {
    el.style.opacity = "1";
    el.style.filter = "none";
    el.style.transform = "none";
  });
  document.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
    el.style.clipPath = "none";
  });
}

export function MotionDirector() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    showNow();
    if (prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.45,
            ease: "power3.out",
            transformOrigin: "left center",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  return null;
}
