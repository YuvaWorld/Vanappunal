import { useMemo } from "react";
import { getJourney } from "@/data/journeys";
import type { Journey, Place } from "@/data/types";
import { logToJourney, logToPlace, mergePlaces } from "@/lib/place-log";
import { useLocalPlaces } from "@/lib/journal-store";

export function useHydrated() {
  return true;
}

export function useAllJourneys(): Journey[] {
  const local = useLocalPlaces();
  return useMemo(() => mergePlaces(local).map(logToJourney), [local]);
}

export function useJourneyBySlug(slug: string): Journey | undefined {
  const all = useAllJourneys();
  return all.find((j) => j.slug === slug) ?? getJourney(slug);
}

export function useAllPlaces(): Place[] {
  const local = useLocalPlaces();
  return useMemo(() => mergePlaces(local).map(logToPlace), [local]);
}
