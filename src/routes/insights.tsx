import { createFileRoute } from "@tanstack/react-router";
import { regions } from "@/data/regions";
import { cmsSlideshow, cmsStats } from "@/data/cms-home";
import { PageHero } from "@/components/layout/page-hero";
import { FieldStats } from "@/components/field-stats";
import { FilmReel } from "@/components/photo-gallery";
import { NewsFeed } from "@/components/news-feed";
import { pageTitle } from "@/data/site";
import { useAllJourneys } from "@/lib/use-field";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({ meta: [{ title: pageTitle("Travel Insights") }] }),
});

const windows = [
  { slug: "himalaya", when: "Oct–Nov" },
  { slug: "alps", when: "Jul–Sep" },
  { slug: "patagonia", when: "Dec–Feb" },
  { slug: "japan", when: "Apr–May, Oct" },
  { slug: "indian-subcontinent", when: "Oct–Mar in the hills" },
  { slug: "sahara", when: "Nov–Feb" },
];

function InsightsPage() {
  const journeys = useAllJourneys();
  const film = [...cmsSlideshow(), ...journeys.flatMap((j) => j.images.filter(Boolean))];

  return (
    <main>
      <PageHero
        eyebrow="Travel Insights"
        title="When to go."
        lede="Short notes from the field — not a guidebook."
      />

      <FieldStats stats={cmsStats()} />
      <FilmReel label="From the field" images={film} />

      <section className="px-4 py-16 sm:px-5 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">Season windows</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {windows.map((w) => {
              const region = regions.find((r) => r.slug === w.slug);
              return (
                <li key={w.slug} className="glass-card p-5">
                  <p className="text-sm text-fg">{region?.title ?? w.slug}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{w.when}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="border-t border-border">
        <NewsFeed compact />
      </div>
    </main>
  );
}
