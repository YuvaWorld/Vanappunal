import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Place } from "@/data/types";
import { isInIndia, locatePlace, type MapPin } from "@/data/geo";
import {
  INDIA_PATHS,
  INDIA_VIEW,
  SRI_PATHS,
  WORLD_PATHS,
  WORLD_VIEW,
  projectIndia,
  projectWorld,
} from "@/data/map-paths";
import { INDIA_STATES } from "@/data/india-states";
import { cn } from "@/lib/utils";
import { FieldNotes } from "@/components/field-notes";

function WorldGrid() {
  const meridians: number[] = [];
  const parallels: number[] = [];
  for (let lng = -150; lng <= 150; lng += 30) meridians.push(lng);
  for (let lat = -60; lat <= 75; lat += 15) parallels.push(lat);
  return (
    <g className="atlas-grid" aria-hidden>
      {meridians.map((lng) => {
        const x = ((lng + 180) / 360) * WORLD_VIEW.w;
        return <line key={`m${lng}`} x1={x} y1={18} x2={x} y2={WORLD_VIEW.h - 12} />;
      })}
      {parallels.map((lat) => {
        const y = ((90 - lat) / 180) * WORLD_VIEW.h;
        return <line key={`p${lat}`} x1={12} y1={y} x2={WORLD_VIEW.w - 12} y2={y} />;
      })}
    </g>
  );
}

export function AtlasMap({ places }: { places: Place[] }) {
  const [view, setView] = useState<"world" | "india">("world");
  const [active, setActive] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);

  const pins = useMemo<MapPin[]>(() => {
    const out: MapPin[] = [];
    for (const place of places) {
      const pos = locatePlace(place);
      if (!pos) continue;
      out.push({
        id: place.id,
        name: place.name,
        country: place.country,
        region: place.region,
        year: place.year,
        note: place.note,
        journeySlug: place.journeySlug,
        ...pos,
      });
    }
    return out;
  }, [places]);

  const shown = view === "india" ? pins.filter(isInIndia) : pins;
  const selected = shown.find((p) => p.id === active) ?? null;
  const project = view === "india" ? projectIndia : projectWorld;
  const vb = view === "india" ? `0 0 ${INDIA_VIEW.w} ${INDIA_VIEW.h}` : `0 0 ${WORLD_VIEW.w} ${WORLD_VIEW.h}`;
  const land = view === "india" ? [...INDIA_PATHS, ...SRI_PATHS] : WORLD_PATHS;
  const pinR = view === "india" ? 10 : 5.2;
  const uid = view === "india" ? "in" : "wo";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="map-switch" role="tablist" aria-label="Map view">
          <button
            type="button"
            role="tab"
            aria-selected={view === "world"}
            className={cn("map-switch-btn", view === "world" && "is-on")}
            onClick={() => {
              setView("world");
              setActive(null);
              setHoverState(null);
            }}
          >
            World
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "india"}
            className={cn("map-switch-btn", view === "india" && "is-on")}
            onClick={() => {
              setView("india");
              setActive(null);
              setHoverState(null);
            }}
          >
            India
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-faint sm:text-xs">
          {view === "india" ? "States · " : ""}
          {shown.length} pin{shown.length === 1 ? "" : "s"}
          {hoverState ? ` · ${hoverState}` : ""}
        </p>
      </div>

      <div
        className={cn(
          "atlas-stage glass-card relative mt-6 overflow-hidden sm:mt-8",
          view === "india" && "atlas-stage-india",
        )}
      >
        <svg
          viewBox={vb}
          className="block h-auto w-full"
          role="img"
          aria-label={view === "india" ? "India with state borders" : "World map"}
        >
          <defs>
            <linearGradient id={`${uid}-land`} x1="18%" y1="8%" x2="86%" y2="92%">
              <stop offset="0%" stopColor="#3f3e38" />
              <stop offset="48%" stopColor="#2c2b26" />
              <stop offset="100%" stopColor="#1a1a16" />
            </linearGradient>
            <filter id={`${uid}-cast`} x="-12%" y="-12%" width="130%" height="140%">
              <feDropShadow dx="10" dy="16" stdDeviation="10" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="#121210" />
          {view === "world" ? <WorldGrid /> : null}
          <g filter={`url(#${uid}-cast)`}>
            {land.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={`url(#${uid}-land)`}
                stroke={view === "world" ? "#4a4942" : "none"}
                strokeWidth={view === "world" ? 0.45 : 0}
              />
            ))}
          </g>
          {view === "india"
            ? INDIA_STATES.map((st) => (
                <g
                  key={st.name}
                  className={cn("atlas-state", hoverState === st.name && "is-on")}
                  onMouseEnter={() => setHoverState(st.name)}
                  onMouseLeave={() => setHoverState((cur) => (cur === st.name ? null : cur))}
                  onClick={() => setHoverState(st.name)}
                >
                  {st.d.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              ))
            : null}
          {shown.map((pin) => {
            const { x, y } = project(pin.lat, pin.lng);
            const on = pin.id === active;
            return (
              <g
                key={pin.id}
                transform={`translate(${x} ${y})`}
                className="atlas-pin cursor-pointer"
                onClick={() => setActive(on ? null : pin.id)}
              >
                <circle className="atlas-pin-hit" r={pinR * 2.4} fill="transparent" />
                {on ? <circle r={pinR * 2.2} className="atlas-pin-ring" /> : <circle r={pinR} className="atlas-pin-glow" />}
                <circle r={pinR} fill="#d8d2c4" />
                <circle r={pinR * 0.36} fill="#0c0c0b" />
              </g>
            );
          })}
        </svg>

        {shown.length === 0 ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-6 px-4 text-center text-sm text-muted">
            No pins here yet.
          </p>
        ) : null}
      </div>

      {selected ? (
        <aside className="glass-card mt-6 p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-faint sm:text-xs">
            {selected.country} · {selected.year}
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">{selected.name}</h2>
          {selected.note ? (
            <div className="mt-3">
              <FieldNotes text={selected.note} className="notes notes-compact" />
            </div>
          ) : null}
          {selected.journeySlug ? (
            <Link
              to="/journeys/$slug"
              params={{ slug: selected.journeySlug }}
              className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-accent hover:text-fg"
            >
              Open journey
            </Link>
          ) : null}
        </aside>
      ) : (
        <p className="mt-4 text-sm text-faint">{view === "india" ? "Tap a state or a pin." : "Tap a pin."}</p>
      )}
    </div>
  );
}
