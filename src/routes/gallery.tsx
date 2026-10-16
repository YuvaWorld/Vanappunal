import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { MediaImg } from "@/components/media-img";
import { useMediaUrl } from "@/lib/media";
import { journeyImages } from "@/data/types";
import { useAllJourneys } from "@/lib/use-field";
import { cn } from "@/lib/utils";
import { pageTitle } from "@/data/site";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [{ title: pageTitle("Gallery") }] }),
});

type Frame = {
  src: string;
  title: string;
  location: string;
  year: string;
  slug: string;
};

function tileClass(index: number, total: number) {
  if (total === 1) return "col-span-2 aspect-[16/10] md:col-span-6";
  if (total === 2) return index === 0 ? "col-span-2 aspect-[16/10] md:col-span-4" : "col-span-2 aspect-[4/5] md:col-span-2 md:aspect-auto";
  const m = index % 7;
  if (m === 0) return "col-span-2 aspect-[16/10] md:col-span-4";
  if (m === 1 || m === 2) return "col-span-1 aspect-[4/5] md:col-span-2";
  if (m === 3) return "col-span-2 aspect-[21/9] md:col-span-6";
  if (m === 4) return "col-span-2 aspect-[5/4] md:col-span-3";
  return "col-span-1 aspect-[4/5] md:col-span-3 md:aspect-[5/4]";
}

function GalleryPage() {
  const journeys = useAllJourneys();
  const chapters = useMemo(
    () =>
      journeys
        .map((journey) => ({
          slug: journey.slug,
          title: journey.title,
          location: journey.location,
          year: journey.year,
          frames: journeyImages(journey).map(
            (src): Frame => ({
              src,
              title: journey.title,
              location: journey.location,
              year: journey.year,
              slug: journey.slug,
            }),
          ),
        }))
        .filter((chapter) => chapter.frames.length),
    [journeys],
  );
  const frames = useMemo(() => chapters.flatMap((chapter) => chapter.frames), [chapters]);
  const [open, setOpen] = useState<number | null>(null);
  const current = open !== null ? frames[open] : null;
  const openUrl = useMediaUrl(current?.src ?? "");

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % frames.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + frames.length) % frames.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, frames.length]);

  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title="The contact sheet."
        lede={
          frames.length
            ? `${String(frames.length).padStart(2, "0")} frames · ${String(chapters.length).padStart(2, "0")} places. One chapter per place you add.`
            : "Add a place in admin and upload photos there. Each place becomes one chapter. All photos also sit on the light table at the top."
        }
      />

      {frames.length === 0 ? (
        <section className="px-4 pb-24 sm:px-5 md:px-10">
          <p className="mx-auto max-w-6xl text-sm text-muted">Photographs will appear here.</p>
        </section>
      ) : (
        <>
          <section className="border-t border-border pb-6 pt-10 md:pb-8 md:pt-14">
            <div className="mx-auto flex max-w-6xl items-end justify-between px-4 sm:px-5 md:px-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Light table</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-faint">Drag sideways</p>
            </div>
            <div className="print-table mt-6" data-lenis-prevent>
              {frames.map((frame, i) => (
                <button
                  key={`table-${frame.src}-${i}`}
                  type="button"
                  data-cursor
                  className={cn("print-card glass-card", i % 3 === 1 ? "is-portrait" : i % 5 === 0 ? "is-wide" : "")}
                  onClick={() => setOpen(i)}
                >
                  <MediaImg src={frame.src} alt={frame.title} />
                  <span className="print-index">{String(i + 1).padStart(3, "0")}</span>
                  <span className="print-name">{frame.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="px-4 py-16 sm:px-5 md:px-10 md:py-24">
            <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
              {chapters.map((chapter, ci) => {
                const start = chapters.slice(0, ci).reduce((n, c) => n + c.frames.length, 0);
                return (
                  <article key={chapter.slug} className="archive-chapter">
                    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                          {String(ci + 1).padStart(2, "0")} · {chapter.year}
                        </p>
                        <h2 className="font-display mt-2 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-fg">
                          {chapter.title}
                        </h2>
                        <p className="mt-2 text-sm text-muted">
                          {chapter.location}
                          <span className="text-faint"> · {String(chapter.frames.length).padStart(2, "0")} frames</span>
                        </p>
                      </div>
                      <Link
                        to="/journeys/$slug"
                        params={{ slug: chapter.slug }}
                        data-cursor
                        className="text-[11px] uppercase tracking-[0.18em] text-muted hover:text-fg"
                      >
                        The log →
                      </Link>
                    </header>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:gap-3">
                      {chapter.frames.map((frame, i) => {
                        const index = start + i;
                        return (
                          <button
                            key={`${frame.src}-${i}`}
                            type="button"
                            data-cursor
                            data-clip
                            className={cn("archive-tile glass-card", tileClass(i, chapter.frames.length))}
                            onClick={() => setOpen(index)}
                          >
                            <MediaImg src={frame.src} alt={frame.title} className="size-full object-cover" />
                            <span className="archive-meta">
                              <span>{String(index + 1).padStart(3, "0")}</span>
                              <span>{frame.title}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      <div className={cn("lightbox", open !== null && "is-open")} aria-hidden={open === null}>
        {current ? (
          <>
            {openUrl ? <img src={openUrl} alt={current.title} /> : null}
            <p className="lightbox-cap">
              {String((open ?? 0) + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
              <span className="mx-2 text-faint">·</span>
              {current.title}
              {current.location ? <span className="text-faint"> · {current.location}</span> : null}
            </p>
            <button type="button" className="lightbox-close" onClick={() => setOpen(null)}>
              Close
            </button>
            {frames.length > 1 ? (
              <>
                <button
                  type="button"
                  className="lightbox-nav left-4"
                  onClick={() => setOpen(((open ?? 0) - 1 + frames.length) % frames.length)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="lightbox-nav right-4"
                  onClick={() => setOpen(((open ?? 0) + 1) % frames.length)}
                >
                  →
                </button>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
