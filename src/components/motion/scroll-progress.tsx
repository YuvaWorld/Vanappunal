import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const p = (e as CustomEvent<{ progress: number }>).detail?.progress ?? 0;
      setProgress(p);
    };
    window.addEventListener("nl-scroll", onScroll);
    return () => window.removeEventListener("nl-scroll", onScroll);
  }, []);

  return (
    <div className="top-line" aria-hidden>
      <span className="top-line-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
