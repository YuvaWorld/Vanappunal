import { Link } from "@tanstack/react-router";
import { getRegion } from "@/data/regions";
import { journeyCover, journeyImages, type Journey } from "@/data/types";
import { Cover } from "./cover";

export function JourneyCard({ journey, large }: { journey: Journey; large?: boolean }) {
  const region = getRegion(journey.region);
  const frames = journeyImages(journey).length;
  const continent = journey.continent || region?.continent || "";
  return (
    <Link to="/journeys/$slug" params={{ slug: journey.slug }} className="glass-card group block overflow-hidden" data-cursor>
      <Cover
        src={journeyCover(journey)}
        alt=""
        className={large ? "aspect-[16/9]" : "aspect-[16/10]"}
      />
      <div className="p-4 md:p-5">
      <div
        data-reveal
        className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted"
      >
        {continent ? <span>{continent}</span> : null}
        {journey.year ? <span className="text-faint">{journey.year}</span> : null}
        {frames > 1 ? (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">
            {frames} frames
          </span>
        ) : null}
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">Field log</span>
      </div>
      <h3
        data-reveal
        className={
          large
            ? "font-display mt-2 text-2xl leading-snug text-fg md:text-3xl"
            : "font-display mt-2 text-xl leading-snug text-fg"
        }
      >
        {journey.title}
      </h3>
      <p data-reveal className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {journey.summary}
      </p>
      </div>
    </Link>
  );
}
