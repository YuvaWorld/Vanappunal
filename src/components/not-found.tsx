import { Link } from "@tanstack/react-router";
import { ArrowLink } from "@/components/arrow-link";

export function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5 py-32 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">404 · Off the map</p>
        <h1 className="font-display mt-6 text-5xl leading-[1.05] text-fg md:text-7xl">
          Route lost.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          This line isn't on the chart. Walk back to camp, or pick a range that is.
        </p>
        <div className="mt-10 flex flex-wrap gap-8">
          <ArrowLink to="/">Back to camp</ArrowLink>
          <Link
            to="/journeys"
            className="text-sm uppercase tracking-[0.18em] text-muted hover:text-fg"
          >
            All journeys
          </Link>
        </div>
      </div>
    </main>
  );
}
