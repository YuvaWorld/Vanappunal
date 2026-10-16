import { useMemo, useState } from "react";
import { cmsNews, newsKindLabel, type NewsKind } from "@/data/cms-news";
import { FieldNotes } from "@/components/field-notes";
import { Cover } from "@/components/cover";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | NewsKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "launch", label: "Launches" },
  { id: "site", label: "New sites" },
];

export function NewsFeed({ compact = false }: { compact?: boolean }) {
  const items = useMemo(() => cmsNews(), []);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const shown = filter === "all" ? items : items.filter((n) => n.kind === filter);

  return (
    <section className={cn("px-4 py-16 sm:px-5 md:px-10", compact ? "py-14" : "md:py-20")}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p data-reveal className="text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">
              Live
            </p>
            <h2 className="font-display mt-3 text-3xl text-fg md:text-4xl">News & launches.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn("map-switch-btn", filter === f.id && "is-on")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 max-w-lg text-sm leading-relaxed text-muted">
            Nothing posted yet. After hosting, add a News item from the admin — a launch, a new
            site, a note from the road.
          </p>
        ) : (
          <ul className={cn("mt-12 grid gap-8", compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3")}>
            {shown.map((n) => (
              <li key={n.slug} className="glass-card flex flex-col overflow-hidden">
                {n.image ? <Cover src={n.image} alt="" className="aspect-[16/10]" clip={false} /> : null}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-faint">
                    {newsKindLabel[n.kind]}
                    {n.date ? ` · ${n.date.slice(0, 10)}` : ""}
                  </p>
                  <h3 className="font-display mt-2 text-2xl leading-snug text-fg">{n.title}</h3>
                  {n.summary ? (
                    <div className="mt-3">
                      <FieldNotes text={n.summary} className="notes notes-compact" />
                    </div>
                  ) : null}
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 text-xs uppercase tracking-[0.16em] text-accent hover:text-fg"
                    >
                      Open →
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
