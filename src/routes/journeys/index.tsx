import { createFileRoute } from "@tanstack/react-router";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/layout/cta-band";
import { JourneyCard } from "@/components/journey-card";
import { PageHero } from "@/components/layout/page-hero";
import { pageTitle } from "@/data/site";
import { useAllJourneys } from "@/lib/use-field";

export const Route = createFileRoute("/journeys/")({
  component: JourneysIndex,
  head: () => ({ meta: [{ title: pageTitle("Journeys") }] }),
});

function JourneysIndex() {
  const all = useAllJourneys();

  return (
    <main>
      <PageHero
        eyebrow="Journeys"
        title="Places on the book."
        lede="Every entry is a place walked — photos, video, a note."
      />

      <section className="px-4 py-12 sm:px-5 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          {all.length ? (
            <div className="grid gap-8 sm:grid-cols-2 md:gap-10">
              {all.map((j) => (
                <JourneyCard key={j.slug} journey={j} />
              ))}
            </div>
          ) : (
            <p className="max-w-md text-sm leading-relaxed text-muted">Nothing logged yet.</p>
          )}
          <div className="mt-10">
            <ArrowLink to="/map">Interactive map</ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
