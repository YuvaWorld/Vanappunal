import { Link } from "@tanstack/react-router";
import { regions } from "@/data/regions";
import { site } from "@/data/site";
import { ArrowLink } from "@/components/arrow-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[color-mix(in_oklab,var(--color-bg-elevated)_70%,transparent)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-5 md:grid-cols-3 md:px-10 md:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Journeys</p>
          <ul className="mt-4 space-y-2">
            {regions.filter((r) => r.slug !== "world").slice(0, 6).map((r) => (
              <li key={r.slug}>
                <Link
                  to="/journeys/regions/$slug"
                  params={{ slug: r.slug }}
                  className="text-sm text-fg/90 transition-colors hover:text-accent"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ArrowLink to="/journeys">All journeys</ArrowLink>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/gallery" className="text-sm text-fg/90 transition-colors hover:text-accent">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/insights" className="text-sm text-fg/90 transition-colors hover:text-accent">
                Travel Insights
              </Link>
            </li>
            <li>
              <Link to="/map" className="text-sm text-fg/90 transition-colors hover:text-accent">
                Interactive Map
              </Link>
            </li>
            <li>
              <Link to="/places" className="text-sm text-fg/90 transition-colors hover:text-accent">
                Places
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-fg/90 transition-colors hover:text-accent">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-2xl text-fg sm:text-3xl">{site.wordmark}</p>
          <p className="mt-2 text-sm italic text-muted">{site.tagline}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            A personal log. Name a place, add photos and videos from your device.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 sm:px-5 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-faint">
          <span>{site.wordmark}</span>
        </div>
      </div>
    </footer>
  );
}
