import type { Journey } from "./types";

export const journeys: Journey[] = [];

export function getJourney(slug: string) {
  return journeys.find((j) => j.slug === slug);
}

export function journeysByRegion(region: string) {
  return journeys.filter((j) => j.region === region);
}

export function journeysByAdventure(adventureSlug: string) {
  return journeys.filter((j) => j.adventureSlugs.includes(adventureSlug));
}

export function allSeedPlaces() {
  return journeys.flatMap((j) => j.places);
}
