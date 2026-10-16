import { lookupGazetteer } from "./gazetteer";

export type LatLng = { lat: number; lng: number };

export type MapPin = {
  id: string;
  name: string;
  country: string;
  region: string;
  year?: string;
  note?: string;
  journeySlug?: string;
  lat: number;
  lng: number;
};

export function locatePlace(input: {
  name: string;
  country: string;
  region: string;
  location?: string;
  lat?: number;
  lng?: number;
}): LatLng | null {
  if (typeof input.lat === "number" && typeof input.lng === "number" && Number.isFinite(input.lat) && Number.isFinite(input.lng)) {
    return { lat: input.lat, lng: input.lng };
  }
  const hit = lookupGazetteer(input.name, input.location, input.country, input.region);
  return hit ? { lat: hit.lat, lng: hit.lng } : null;
}

export function isInIndia(pin: Pick<MapPin, "lat" | "lng" | "country">) {
  if (/india/i.test(pin.country)) return true;
  return pin.lat >= 6.5 && pin.lat <= 37.4 && pin.lng >= 68 && pin.lng <= 97.6;
}
