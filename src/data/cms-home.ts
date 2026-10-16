const files = import.meta.glob("../../content/site/*.json", { eager: true, import: "default" });

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function asList(v: unknown) {
  if (!Array.isArray(v)) return [] as string[];
  return v
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        return asString(row.photo || row.image || row.src);
      }
      return "";
    })
    .filter(Boolean);
}

function homeRow() {
  const raw = files["../../content/site/home.json"];
  return (raw ?? {}) as Record<string, unknown>;
}

function insightsRow() {
  const raw = files["../../content/site/insights.json"];
  return (raw ?? {}) as Record<string, unknown>;
}

export function cmsPortrait(): string {
  const row = homeRow();
  return asString(row.portrait) || asString(row.image) || asString(row.photo);
}

export function cmsHeroVideo(): string {
  const row = homeRow();
  return asString(row.video) || asString(row.heroVideo);
}

export function cmsSlideshow(): string[] {
  return asList(homeRow().slideshow);
}

export type FieldStat = { value: string; label: string };

const FALLBACK_STATS: FieldStat[] = [
  { value: "0", label: "Places visited" },
  { value: "0", label: "States explored" },
  { value: "2026", label: "Travel year" },
  { value: "0 km", label: "Distance logged" },
];

export function cmsStats(): FieldStat[] {
  const raw = insightsRow().stats;
  if (!Array.isArray(raw) || !raw.length) return FALLBACK_STATS;
  const out = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const value = asString(row.value);
      const label = asString(row.label);
      if (!value || !label) return null;
      return { value, label };
    })
    .filter((s): s is FieldStat => Boolean(s));
  return out.length ? out : FALLBACK_STATS;
}
