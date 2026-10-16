import { createFileRoute } from "@tanstack/react-router";
import { getRegion } from "@/data/regions";
import { journeyCover, journeyImages, journeyVideos } from "@/data/types";
import { Cover } from "@/components/cover";
import { CtaBand } from "@/components/layout/cta-band";
import { ArrowLink } from "@/components/arrow-link";
import { NotFound } from "@/components/not-found";
import { PhotoGallery } from "@/components/photo-gallery";
import { VideoReel } from "@/components/video-reel";
import { FieldNotes } from "@/components/field-notes";
import { SplitHeading } from "@/components/motion/split-heading";
import { useJourneyBySlug } from "@/lib/use-field";

export const Route = createFileRoute("/journeys/$slug")({
  component: JourneyPage,
});

function JourneyPage() {
  const { slug } = Route.useParams();
  const journey = useJourneyBySlug(slug);

  if (!journey) return <NotFound />;

  const region = getRegion(journey.region);
  const continent = journey.continent || region?.continent || "";
  const frames = journeyImages(journey);
  const film = journeyVideos(journey);
  const notes = journey.body.join("\n\n");

  return (
    <main>
      <header className="relative min-h-[52vh] overflow-hidden sm:min-h-[62vh] md:min-h-[70vh]">
        <Cover src={journeyCover(journey)} alt="" className="absolute inset-0" ken />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/25" />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[62vh] sm:px-5 sm:pb-12 sm:pt-28 md:min-h-[70vh] md:px-10 md:pb-14">
          <p data-reveal="load" className="text-[11px] uppercase tracking-[0.22em] text-accent sm:text-xs">
            {[continent, journey.year, "Field log"].filter(Boolean).join(" · ")}
          </p>
          <SplitHeading
            as="h1"
            text={journey.title}
            delay={0.08}
            className="font-display mt-3 max-w-4xl text-[clamp(1.85rem,6vw,3.75rem)] leading-[1.1]"
          />
          {journey.location ? (
            <p data-reveal="load" className="mt-4 max-w-2xl text-sm text-fg/80 md:text-base">
              {journey.location}
              {region && region.slug !== "world" ? ` · ${region.title}` : ""}
            </p>
          ) : null}
        </div>
      </header>

      <PhotoGallery images={frames} title={journey.title} />
      <VideoReel videos={film} title={journey.title} />

      {notes.trim() ? (
        <section className="px-4 py-14 sm:px-5 md:px-10 md:py-16">
          <div className="mx-auto max-w-3xl" data-reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Notes</p>
            <div className="mt-6">
              <FieldNotes text={notes} />
            </div>
            <div className="mt-10">
              <ArrowLink to="/places">All places</ArrowLink>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-10 sm:px-5 md:px-10">
          <div className="mx-auto max-w-3xl">
            <ArrowLink to="/places">All places</ArrowLink>
          </div>
        </section>
      )}

      <CtaBand />
    </main>
  );
}
