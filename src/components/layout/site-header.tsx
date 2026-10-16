import { useEffect, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { regions } from "@/data/regions";
import { useAllJourneys } from "@/lib/use-field";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { ArrowLink } from "@/components/arrow-link";

type Panel = "journeys" | "mobile" | null;

export function SiteHeader() {
  const [panel, setPanel] = useState<Panel>(null);
  const [away, setAway] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();

  useEffect(() => {
    const light = ["/", "/gallery", "/insights", "/about", "/journeys", "/places"] as const;
    const warm = () => {
      for (const to of light) void router.preloadRoute({ to });
    };
    const idle = window.requestIdleCallback?.(warm) ?? window.setTimeout(warm, 400);
    const mapTimer = window.setTimeout(() => {
      void router.preloadRoute({ to: "/map" });
    }, 2000);
    return () => {
      window.clearTimeout(mapTimer);
      if (typeof idle === "number") window.clearTimeout(idle);
      else window.cancelIdleCallback?.(idle);
    };
  }, [router]);

  useEffect(() => {
    setPanel(null);
    setAway(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [panel]);

  useEffect(() => {
    let last = 0;
    const readY = (e?: Event) => {
      const p = (e as CustomEvent<{ progress: number }> | undefined)?.detail?.progress;
      if (typeof p === "number") return p * Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return window.scrollY;
    };
    const onScroll = (e: Event) => {
      const y = readY(e);
      if (panel) {
        setAway(false);
        last = y;
        return;
      }
      if (y < 48) setAway(false);
      else if (y > last + 10) setAway(true);
      else if (y < last - 10) setAway(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("nl-scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("nl-scroll", onScroll);
    };
  }, [panel]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-away", away && !panel);
    return () => document.documentElement.classList.remove("nav-away");
  }, [away, panel]);

  const toggle = (next: Panel) => setPanel((p) => (p === next ? null : next));

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50",
          panel ? "bg-bg" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5 md:h-[4.25rem] md:px-10">
          <Link to="/" className="flex items-center text-fg" onClick={() => setPanel(null)}>
            <span className="text-[11px] font-medium tracking-[0.2em] sm:text-sm">{site.wordmark}</span>
          </Link>

          <nav className="hidden items-center gap-4 lg:gap-6 xl:gap-7 md:flex">
            <NavButton active={panel === "journeys"} onClick={() => toggle("journeys")}>
              Journeys
            </NavButton>
            <Link
              to="/gallery"
              preload="intent"
              className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg lg:text-xs lg:tracking-[0.18em]"
            >
              Gallery
            </Link>
            <Link
              to="/insights"
              preload="intent"
              className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg lg:text-xs lg:tracking-[0.18em]"
            >
              <span className="xl:hidden">Insights</span>
              <span className="hidden xl:inline">Travel Insights</span>
            </Link>
            <Link
              to="/about"
              preload="intent"
              className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg lg:text-xs lg:tracking-[0.18em]"
            >
              About
            </Link>
            <Link
              to="/map"
              preload="intent"
              className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg lg:text-xs lg:tracking-[0.18em]"
            >
              <span className="xl:hidden">Map</span>
              <span className="hidden xl:inline">Interactive Map</span>
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-fg md:hidden"
            aria-label={panel === "mobile" ? "Close menu" : "Open menu"}
            onClick={() => toggle("mobile")}
          >
            {panel === "mobile" ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "mega-panel fixed inset-x-0 z-40 max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto bg-bg top-[var(--nav-h)]",
          panel && panel !== "mobile" ? "is-open pointer-events-auto" : "pointer-events-none",
        )}
      >
        {panel === "journeys" ? <JourneysPanel onClose={() => setPanel(null)} /> : null}
      </div>

      {panel && panel !== "mobile" ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-bg/50"
          onClick={() => setPanel(null)}
        />
      ) : null}

      {panel === "mobile" ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-[var(--nav-h)] md:hidden">
          <div className="flex flex-col gap-1 px-5 py-8">
            <Link to="/journeys" className="py-3 text-2xl font-display text-fg">
              Journeys
            </Link>
            <Link to="/gallery" className="py-3 text-2xl font-display text-fg">
              Gallery
            </Link>
            <Link to="/insights" className="py-3 text-2xl font-display text-fg">
              Travel Insights
            </Link>
            <Link to="/map" className="py-3 text-2xl font-display text-fg">
              Interactive Map
            </Link>
            <Link to="/places" className="py-3 text-2xl font-display text-fg">
              Places
            </Link>
            <Link to="/about" className="py-3 text-2xl font-display text-fg">
              About
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

function NavButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative text-[11px] uppercase tracking-[0.14em] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-300 hover:text-fg hover:after:scale-x-100 lg:text-xs lg:tracking-[0.18em]",
        active ? "text-fg after:scale-x-100" : "text-muted",
      )}
    >
      {children}
    </button>
  );
}

function JourneysPanel({ onClose }: { onClose: () => void }) {
  const all = useAllJourneys();
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">By range</p>
        </div>
        <div onClick={onClose}>
          <ArrowLink to="/journeys">All journeys</ArrowLink>
        </div>
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
        {regions
          .filter((r) => r.slug !== "world")
          .map((r) => {
            const count = all.filter((j) => j.region === r.slug).length;
            return (
              <li key={r.slug} data-mega-item>
                <Link
                  to="/journeys/regions/$slug"
                  params={{ slug: r.slug }}
                  onClick={onClose}
                  className="flex items-baseline justify-between border-b border-border py-3 transition-colors hover:text-accent"
                >
                  <span>
                    <span className="text-sm text-fg">{r.title}</span>
                    <span className="ml-3 text-xs text-faint">{r.continent}</span>
                  </span>
                  <span className="text-xs text-muted">{count ? `${count} logged` : ""}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
