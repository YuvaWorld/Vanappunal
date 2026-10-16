import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/page-hero";
import { pageTitle } from "@/data/site";
import { useAllPlaces } from "@/lib/use-field";

const AtlasMap = lazy(() =>
  import("@/components/atlas-map").then((m) => ({ default: m.AtlasMap })),
);

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({ meta: [{ title: pageTitle("Map") }] }),
});

function MapPage() {
  const places = useAllPlaces();

  return (
    <main>
      <PageHero
        eyebrow="Atlas"
        title="Where the pins are."
        lede="World or India. India shows state borders. Every logged place is a pin."
      />
      <section className="px-4 py-10 sm:px-5 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<div className="glass-card min-h-[70vw] md:min-h-[560px]" />}>
            <AtlasMap places={places} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
