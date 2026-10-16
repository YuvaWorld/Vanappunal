import { getRegion } from "./regions";

export type PlaceClass = {
  region: string;
  continent: string;
};

const HIMALAYA =
  /\b(leh|ladakh|kashmir|nepal|kathmandu|pokhara|bhutan|thimphu|tibet|lhasa|everest|annapurna|manali|shimla|spiti|kinnaur|kullu|nubra|pangong|sikkim|gangtok|darjeeling|uttarakhand|rishikesh|kedarnath|badrinath|himachal|srinagar|gulmarg|pahalgam|namche|lukla|mustang|himalaya)\b/i;

const JAPAN = /\b(japan|tokyo|kyoto|osaka|hokkaido|nara|hiroshima|fuji|nikko)\b/i;
const ALPS = /\b(alps|chamonix|zermatt|interlaken|dolomit|tyrol|courmayeur|grindelwald|mont blanc)\b/i;
const ANDES = /\b(andes|cusco|cuzco|machu|patagonia|torres del paine|ushuaia|mendoza|quito|bogot|arequipa|atacama)\b/i;
const PATAGONIA = /\b(patagonia|ushuaia|el calafate|fitz roy|torres del paine)\b/i;
const SAHARA = /\b(sahara|marrakech|marrakesh|fez|atlas mountains|erg|tassili|siwa)\b/i;
const EAST_AFRICA = /\b(kenya|tanzania|ethiopia|uganda|rwanda|serengeti|kilimanjaro|simien|nairobi|arusha)\b/i;
const MED = /\b(mediterranean|amalfi|cinque terre|santorini|crete|sicily|mallorca|ibiza|croatia|dubrovnik)\b/i;
const ROCKIES = /\b(rockies|colorado|banff|jasper|yellowstone|yosemite|leadville|denver|vancouver|calgary)\b/i;
const ARCTIC = /\b(arctic|svalbard|iceland|greenland|tromso|lapland|alaska|fairbanks)\b/i;
const INDIA_LOW =
  /\b(chennai|mumbai|delhi|bengaluru|bangalore|hyderabad|kolkata|kerala|goa|rajasthan|jaipur|udaipur|jaisalmer|tamil|madurai|thanjavur|brihadeeswara|brihadeeswarar|pondicherry|pune|ahmedabad|varanasi|agra)\b/i;
const MEXICO = /\b(mexico|chapultepec|oaxaca|cdmx|ciudad de mexico|yucatan|cancun|tulum)\b/i;
const CAPE = /\b(cape town|south africa|table mountain|stellenbosch|kruger)\b/i;

function blobOf(p: { name?: string; location?: string }) {
  return [p.name, p.location].filter(Boolean).join(" ").toLowerCase();
}

function continentFromCoords(lat: number, lng: number): string {
  if (lat >= 66) return "Circumpolar";
  if (lat <= -60) return "Antarctica";
  if (lng >= -170 && lng <= -26 && lat >= 7 && lat <= 84) return "North America";
  if (lng >= -92 && lng <= -34 && lat >= -56 && lat < 13) return "South America";
  if (lng >= -20 && lng <= 55 && lat >= -35 && lat <= 37.5) {
    if (lat >= 15) return "Africa";
    return "Africa";
  }
  if (lng >= -11 && lng <= 40 && lat >= 35 && lat <= 72) return "Europe";
  if (lng >= 60 && lng <= 97 && lat >= 5 && lat <= 38) return "South Asia";
  if (lng >= 122 && lng <= 154 && lat >= 24 && lat <= 46) return "East Asia";
  if (lng >= 95 && lng <= 155 && lat >= -50 && lat <= 10) return "Oceania";
  if (lng >= 25 && lng <= 180 && lat >= -10 && lat <= 80) return "Asia";
  return "World";
}

function fromCoords(lat: number, lng: number): PlaceClass {
  if (lat >= 24 && lat <= 46 && lng >= 123 && lng <= 146) {
    return { region: "japan", continent: "East Asia" };
  }
  if (lat <= -39 && lat >= -56 && lng >= -76 && lng <= -62) {
    return { region: "patagonia", continent: "South America" };
  }
  if (lat >= -40 && lat <= 12 && lng >= -82 && lng <= -64) {
    return { region: "andes", continent: "South America" };
  }
  if (lat >= 43.5 && lat <= 48.5 && lng >= 5 && lng <= 16.5) {
    return { region: "alps", continent: "Europe" };
  }
  if (lat >= 35 && lat <= 60 && lng >= -125 && lng <= -104) {
    return { region: "rockies", continent: "North America" };
  }
  if (lat >= 66) {
    return { region: "arctic", continent: "Circumpolar" };
  }
  if (lat >= 16 && lat <= 34 && lng >= -17 && lng <= 33) {
    return { region: "sahara", continent: "Africa" };
  }
  if (lat >= -12 && lat <= 15 && lng >= 29 && lng <= 43) {
    return { region: "east-africa", continent: "Africa" };
  }
  if (lat >= -35 && lat <= -22 && lng >= 14 && lng <= 33) {
    return { region: "southern-africa", continent: "Africa" };
  }
  if (lat >= 31 && lat <= 45 && lng >= -6 && lng <= 28) {
    return { region: "mediterranean", continent: "Europe / North Africa" };
  }
  if (lat >= 26.8 && lat <= 37.2 && lng >= 72 && lng <= 97) {
    return { region: "himalaya", continent: "South Asia" };
  }
  if (lat >= 6 && lat <= 37.2 && lng >= 68 && lng <= 97.5) {
    return { region: "indian-subcontinent", continent: "South Asia" };
  }
  if (lat >= 14 && lat <= 33 && lng >= -118 && lng <= -86) {
    return { region: "north-america", continent: "North America" };
  }
  if (lng >= -170 && lng <= -26 && lat >= 7 && lat <= 84) {
    return { region: "north-america", continent: "North America" };
  }
  if (lng >= -25 && lng <= 52 && lat >= -35 && lat < 0) {
    return { region: "southern-africa", continent: "Africa" };
  }
  if (lng >= -25 && lng <= 52 && lat >= 0 && lat <= 37) {
    return { region: "sahara", continent: "Africa" };
  }
  if (lng >= -92 && lng <= -34 && lat >= -56 && lat < 13) {
    return { region: "andes", continent: "South America" };
  }
  if (lng >= -11 && lng <= 40 && lat >= 35 && lat <= 72) {
    return { region: "alps", continent: "Europe" };
  }

  const continent = continentFromCoords(lat, lng);
  return { region: regionForContinent(continent), continent };
}

function fromName(blob: string, country: string): PlaceClass {
  const hay = `${blob} ${country}`.toLowerCase();
  if (JAPAN.test(hay)) return { region: "japan", continent: "East Asia" };
  if (PATAGONIA.test(hay)) return { region: "patagonia", continent: "South America" };
  if (ANDES.test(hay)) return { region: "andes", continent: "South America" };
  if (ALPS.test(hay)) return { region: "alps", continent: "Europe" };
  if (ROCKIES.test(hay)) return { region: "rockies", continent: "North America" };
  if (ARCTIC.test(hay)) return { region: "arctic", continent: "Circumpolar" };
  if (SAHARA.test(hay)) return { region: "sahara", continent: "Africa" };
  if (EAST_AFRICA.test(hay)) return { region: "east-africa", continent: "Africa" };
  if (MED.test(hay)) return { region: "mediterranean", continent: "Europe / North Africa" };
  if (HIMALAYA.test(hay) || /\bnepal|bhutan\b/i.test(country)) {
    return { region: "himalaya", continent: "South Asia" };
  }
  if (INDIA_LOW.test(hay) || /^india$/i.test(country.trim())) {
    return { region: "indian-subcontinent", continent: "South Asia" };
  }
  if (MEXICO.test(hay) || /mexico|united states|canada|usa/i.test(country)) {
    return { region: "north-america", continent: "North America" };
  }
  if (CAPE.test(hay) || /south africa|namibia|botswana/i.test(country)) {
    return { region: "southern-africa", continent: "Africa" };
  }
  return { region: "world", continent: guessContinent(hay, country) };
}

function guessContinent(blob: string, country: string) {
  const hay = `${blob} ${country}`;
  if (/\bmexico|canada|united states|usa\b/i.test(hay)) return "North America";
  if (/\bbrazil|chile|argentina|peru|colombia\b/i.test(hay)) return "South America";
  if (/\bsouth africa|cape town|namibia|botswana\b/i.test(hay)) return "Africa";
  if (/\bfrance|italy|spain|germany|uk|england\b/i.test(hay)) return "Europe";
  if (/\bnepal|india|bangladesh|sri lanka|pakistan\b/i.test(hay)) return "South Asia";
  return "World";
}

function regionForContinent(continent: string) {
  if (continent === "North America") return "north-america";
  if (continent === "South America") return "andes";
  if (continent === "Africa" || continent === "North Africa") return "southern-africa";
  if (continent === "Europe") return "alps";
  if (continent === "South Asia") return "indian-subcontinent";
  if (continent === "East Asia") return "japan";
  if (continent === "Circumpolar") return "arctic";
  return "world";
}

export function classifyPlace(input: {
  name?: string;
  location?: string;
  country?: string;
  lat?: number;
  lng?: number;
}): PlaceClass {
  const blob = blobOf(input);
  const country = input.country ?? "";
  const lat = typeof input.lat === "number" ? input.lat : NaN;
  const lng = typeof input.lng === "number" ? input.lng : NaN;
  const has = Number.isFinite(lat) && Number.isFinite(lng);

  if (has) return fromCoords(lat, lng);
  return fromName(blob, country);
}

export function continentOf(regionSlug: string, fallback?: string) {
  return getRegion(regionSlug)?.continent ?? fallback ?? "";
}
