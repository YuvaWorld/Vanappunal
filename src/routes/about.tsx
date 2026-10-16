import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/layout/page-hero";
import { NewsFeed } from "@/components/news-feed";
import { pageTitle } from "@/data/site";
import { useAllJourneys } from "@/lib/use-field";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: pageTitle("About") }] }),
});

const STAMP_YEARS = ["2026"];

function placeKey(title: string) {
  return title.trim().toLowerCase();
}

function AboutPage() {
  const journeys = useAllJourneys();
  const years = [...new Set([...STAMP_YEARS, ...journeys.map((j) => j.year).filter(Boolean)])].sort(
    (a, b) => Number(b) - Number(a),
  );
  const stampYear = journeys.find((j) => j.year)?.year || "2026";
  const visitCount = new Map<string, number>();
  for (const journey of journeys) {
    const key = placeKey(journey.title);
    if (!key) continue;
    visitCount.set(key, (visitCount.get(key) ?? 0) + 1);
  }

  return (
    <main className="about-page">
      <img src="/images/mark.png" alt="" aria-hidden className="about-watermark" decoding="async" />
      <PageHero eyebrow="The field journal" title="Places I walked." />

      <section className="px-4 pb-12 sm:px-5 md:px-10 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <ul className="grid gap-4 sm:grid-cols-2">
            <li className="about-card">
              <p className="text-[10px] uppercase tracking-[0.22em] text-faint">Name</p>
              <p className="mt-5 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 border border-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] px-3 py-2">
                <span className="text-[11px] uppercase tracking-[0.38em] text-fg sm:text-xs">A.Yuvaraj</span>
                <span className="text-[11px] tracking-[0.22em] text-muted">{stampYear}</span>
              </p>
            </li>
            <li className="about-card">
              <p className="text-[10px] uppercase tracking-[0.22em] text-faint">Email</p>
              <a
                href="mailto:atreusk459@gmail.com"
                className="mt-3 block break-all font-display text-[clamp(1.15rem,4.4vw,1.85rem)] leading-snug text-fg transition-colors hover:text-accent"
              >
                atreusk459@gmail.com
              </a>
            </li>
          </ul>

          <p className="mt-10 max-w-2xl font-display text-[clamp(1.35rem,3vw,1.85rem)] leading-snug text-fg">
            I am A.Yuvaraj. Vanappunal is the record of where I have walked.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Photographs, film, and a pin for each place. Notes from the road stay here.
          </p>

          <div className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Years</p>
            <ul className="mt-4 border-t border-border">
              {years.map((year) => {
                const seen = new Set<string>();
                const places = journeys.filter((j) => {
                  if (j.year !== year) return false;
                  const key = placeKey(j.title);
                  if ((visitCount.get(key) ?? 0) < 2 || seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                return (
                  <li
                    key={year}
                    className="grid grid-cols-1 items-baseline gap-3 border-b border-border py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-10"
                  >
                    <span className="font-display text-3xl leading-none text-fg md:text-4xl">{year}</span>
                    {places.length ? (
                      <ul className="min-w-0">
                        {places.map((place) => (
                          <li key={place.slug}>
                            <Link
                              to="/journeys/$slug"
                              params={{ slug: place.slug }}
                              className="flex items-baseline justify-between gap-4 py-1 text-sm text-fg/90 transition-colors hover:text-accent"
                            >
                              <span>{place.title}</span>
                              <span className="shrink-0 text-xs tracking-[0.14em] text-muted">
                                {String(visitCount.get(placeKey(place.title)) ?? 0).padStart(2, "0")}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <div className="border-t border-border">
        <NewsFeed />
      </div>

      <CtaBand />
    </main>
  );
}
