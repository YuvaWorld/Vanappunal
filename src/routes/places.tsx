import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/layout/page-hero";
import { Cover } from "@/components/cover";
import { getRegion } from "@/data/regions";
import { useAllPlaces } from "@/lib/use-field";
import { pageTitle } from "@/data/site";
import { FieldNotes } from "@/components/field-notes";

export const Route = createFileRoute("/places")({
  component: PlacesPage,
  head: () => ({ meta: [{ title: pageTitle("Places") }] }),
});

function PlacesPage() {
  const places = useAllPlaces();

  return (
    <main>
      <PageHero
        eyebrow="The atlas"
        title="Places visited."
        lede="Every pin is a place logged — name, photos, video."
      />

      <section className="px-4 py-10 sm:px-5 md:px-10">
        <div className="mx-auto max-w-6xl">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((p) => {
              const cover = p.images?.[0];
              const region = getRegion(p.region);
              return (
                <li key={p.id} className="glass-card flex flex-col overflow-hidden">
                  {cover ? <Cover src={cover} alt="" className="aspect-[16/10]" clip={false} /> : null}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm uppercase tracking-[0.16em] text-faint">
                      {region?.continent || p.country} · {p.year}
                    </p>
                    <h2 className="mt-2 text-lg text-fg">{p.name}</h2>
                    <p className="text-sm text-muted">
                      {[p.location, p.country].filter(Boolean).join(" · ")}
                    </p>
                    {p.note ? (
                      <div className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
                        <FieldNotes text={p.note} className="notes notes-compact" />
                      </div>
                    ) : (
                      <span className="flex-1" />
                    )}
                    {p.journeySlug ? (
                      <Link
                        to="/journeys/$slug"
                        params={{ slug: p.journeySlug }}
                        className="mt-4 text-xs uppercase tracking-[0.16em] text-fg hover:text-accent"
                      >
                        Open →
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
          {places.length === 0 ? (
            <p className="mt-10 text-sm text-muted">No places yet.</p>
          ) : null}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
