import { memo, useLayoutEffect, useState } from "react";
import { markReady } from "@/lib/ready";
import { site } from "@/data/site";

export const PRELOADER_BOOT = `(function(){function done(){window.__averuneReady=true;try{sessionStorage.setItem("averune.booted","1")}catch(e){}window.dispatchEvent(new Event("averune:ready"))}try{if(sessionStorage.getItem("averune.booted")==="1"){window.__averuneBoot=1;document.documentElement.classList.add("averune-ready");done();return}}catch(e){}if(window.__averuneBoot)return;window.__averuneBoot=1;function ease(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2}function go(){var el=document.getElementById("preloader-pct");var root=document.getElementById("preloader");if(!el||!root){return void setTimeout(go,16)}var t0=performance.now();var dur=720;function tick(now){var p=Math.min(1,(now-t0)/dur);el.textContent=String(Math.round(ease(p)*100)).padStart(3,"0");if(p<1)requestAnimationFrame(tick);else{done();root.style.transition="transform 0.42s cubic-bezier(0.76,0,0.24,1)";root.style.transform="translateY(-110%)"}}requestAnimationFrame(tick)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go()})();`;

export const Preloader = memo(function Preloader() {
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    if (window.__averuneReady || document.documentElement.classList.contains("averune-ready")) {
      markReady();
      setGone(true);
      return;
    }
    const done = () => {
      markReady();
      setGone(true);
    };
    window.addEventListener("averune:ready", done);
    const fallback = window.setTimeout(done, 1400);
    return () => {
      window.removeEventListener("averune:ready", done);
      window.clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-bg px-4 pb-10 sm:px-5 md:px-10 md:pb-14"
      aria-hidden
      suppressHydrationWarning
    >
      <p className="text-xs uppercase tracking-[0.28em] text-muted">{site.wordmark}</p>
      <p className="font-display mt-4 text-[clamp(4.5rem,22vw,12rem)] leading-[0.8] tabular-nums text-fg">
        <span id="preloader-pct" suppressHydrationWarning>
          000
        </span>
        <span className="text-[0.35em] tracking-normal">%</span>
      </p>
      <p className="mt-4 text-sm italic text-muted">{site.tagline}</p>
    </div>
  );
});
