import { cmsPlaces } from "@/data/cms-places";
import { classifyPlace } from "@/data/classify";
import type { Journey, Place } from "@/data/types";
import type { LogPlace } from "@/lib/journal-store";

function yearOf(date: string) {
  const m = date.match(/\d{4}/);
  return m?.[0] ?? "";
}

export function logToJourney(p: LogPlace): Journey {
  const year = yearOf(p.date);
  const classified = classifyPlace(p);
  return {
    slug: p.slug,
    title: p.name,
    region: classified.region,
    continent: classified.continent,
    year,
    dates: p.date,
    location: p.location || p.country,
    summary: firstParagraph(p.description),
    body: p.description ? [p.description] : [],
    stats: [],
    places: [logToPlace(p)],
    adventureSlugs: [],
    featured: true,
    image: p.photos[0] ?? "",
    images: p.photos,
    videos: p.videos,
    custom: true,
    lat: p.lat,
    lng: p.lng,
  };
}

function firstParagraph(text: string) {
  if (!text) return "";
  const block = text.replace(/\r\n/g, "\n").split(/\n\s*\n/)[0] ?? "";
  return block
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function logToPlace(p: LogPlace): Place {
  const classified = classifyPlace(p);
  return {
    id: p.id,
    name: p.name,
    country: p.country,
    region: classified.region,
    year: yearOf(p.date),
    note: p.description,
    journeySlug: p.slug,
    custom: true,
    images: p.photos,
    videos: p.videos,
    lat: p.lat,
    lng: p.lng,
    location: p.location,
  };
}

export function mergePlaces(local: LogPlace[]): LogPlace[] {
  const published = cmsPlaces();
  const seen = new Set(local.map((p) => p.slug));
  return [...local, ...published.filter((p) => !seen.has(p.slug))];
}
