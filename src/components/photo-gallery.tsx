import { useEffect, useState } from "react";
import { MediaImg } from "@/components/media-img";
import { useMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function PhotoGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const frames = images.filter(Boolean);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % frames.length));
      if (e.key === "ArrowLeft")
        setOpen((i) => (i === null ? i : (i - 1 + frames.length) % frames.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, frames.length]);

  if (!frames.length) return null;

  return (
    <>
      <section className="border-t border-border px-4 py-12 sm:px-5 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p data-reveal className="text-xs uppercase tracking-[0.22em] text-muted">
            Photos
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {frames.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                data-clip
                data-cursor
                className={cn(
                  "glass-card overflow-hidden",
                  i === 0 ? "col-span-2 aspect-[16/9] md:col-span-2 md:row-span-2 md:aspect-auto md:h-full" : "aspect-[4/5]",
                )}
                onClick={() => setOpen(i)}
              >
                <MediaImg src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={cn("lightbox", open !== null && "is-open")} aria-hidden={open === null}>
        {open !== null ? (
          <>
            <LightboxImage src={frames[open]} alt={title} />
            <p className="lightbox-cap">
              {String(open + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
            </p>
            <button type="button" className="lightbox-close" onClick={() => setOpen(null)}>
              Close
            </button>
            {frames.length > 1 ? (
              <>
                <button
                  type="button"
                  className="lightbox-nav left-4"
                  onClick={() => setOpen((open - 1 + frames.length) % frames.length)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="lightbox-nav right-4"
                  onClick={() => setOpen((open + 1) % frames.length)}
                >
                  →
                </button>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const url = useMediaUrl(src);
  if (!url) return null;
  return <img src={url} alt={alt} />;
}

export function FilmReel({ images, label = "From the field" }: { images: string[]; label?: string }) {
  const frames = images.filter(Boolean);
  if (!frames.length) return null;
  const loop = frames.length === 1 ? [...frames, ...frames, ...frames] : [...frames, ...frames];
  return (
    <section className="overflow-hidden border-t border-border py-10">
      <p className="mb-6 px-4 text-xs uppercase tracking-[0.22em] text-muted sm:px-5 md:px-10">{label}</p>
      <div className="film-reel">
        {loop.map((src, i) => (
          <div key={`${src}-${i}`} className="film-frame">
            <MediaImg src={src} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
