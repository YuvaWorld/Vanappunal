import type { LogPlace } from "@/lib/journal-store";

const files = import.meta.glob("../../content/places/*.json", { eager: true, import: "default" });

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function asNumber(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function asList(v: unknown) {
  if (!Array.isArray(v)) return [] as string[];
  return v
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "photo" in item) return asString((item as { photo: unknown }).photo);
      if (item && typeof item === "object" && "video" in item) return asString((item as { video: unknown }).video);
      if (item && typeof item === "object" && "image" in item) return asString((item as { image: unknown }).image);
      return "";
    })
    .filter(Boolean);
}

function slugFromPath(path: string) {
  return path.split("/").pop()?.replace(/\.json$/i, "") ?? "place";
}

export function cmsPlaces(): LogPlace[] {
  const out: LogPlace[] = [];
  for (const [path, raw] of Object.entries(files)) {
    const row = (raw ?? {}) as Record<string, unknown>;
    const name = asString(row.title) || asString(row.name);
    if (!name) continue;
    const lat = asNumber(row.lat);
    const lng = asNumber(row.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const slug = asString(row.slug) || slugFromPath(path);
    out.push({
      id: asString(row.id) || slug,
      slug,
      name,
      location: asString(row.location),
      country: asString(row.country),
      description: asString(row.description) || asString(row.body),
      date: asString(row.date) || asString(row.year),
      lat,
      lng,
      photos: asList(row.photos).length ? asList(row.photos) : asList(row.images),
      videos: asList(row.videos),
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}
