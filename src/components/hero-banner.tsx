import { useEffect, useRef } from "react";
import { useMediaUrl } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/gsap-client";
import { cn } from "@/lib/utils";

export function HeroBanner({ photo, video }: { photo: string; video: string }) {
  const videoUrl = useMediaUrl(video);
  const photoUrl = useMediaUrl(photo);
  const ref = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(videoUrl);
  const hasPhoto = Boolean(photoUrl);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.pause();
      return;
    }
    const play = () => {
      void el.play().catch(() => undefined);
    };
    play();
    el.addEventListener("canplay", play);
    return () => el.removeEventListener("canplay", play);
  }, [videoUrl]);

  return (
    <>
      {hasVideo ? (
        <div className={cn("hero-cinematic", hasPhoto && "hero-cinematic-back")}>
          <video
            ref={ref}
            src={videoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden
          />
        </div>
      ) : null}

      {hasPhoto ? (
        <div className={cn("hero-photo", hasVideo && "hero-photo-over")}>
          <img src={photoUrl} alt="" className="hero-ken origin-center" />
        </div>
      ) : null}

      {!hasPhoto && !hasVideo ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#161612] via-bg to-bg" />
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          hasVideo && hasPhoto
            ? "bg-gradient-to-t from-bg via-bg/75 to-bg/45"
            : "bg-gradient-to-t from-bg via-bg/70 to-bg/25",
        )}
      />
    </>
  );
}
