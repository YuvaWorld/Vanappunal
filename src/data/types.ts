export type Stat = { label: string; value: string };

export type Place = {
  id: string;
  name: string;
  country: string;
  region: string;
  year: string;
  note: string;
  journeySlug?: string;
  custom?: boolean;
  images?: string[];
  videos?: string[];
  lat?: number;
  lng?: number;
  location?: string;
};

export type Adventure = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  lede: string;
  body: string[];
  approach: { title: string; text: string }[];
  popular?: boolean;
  image: string;
};

export type Region = {
  slug: string;
  title: string;
  continent: string;
  lede: string;
  body: string;
};

export type Journey = {
  slug: string;
  title: string;
  region: string;
  continent?: string;
  year: string;
  dates: string;
  location: string;
  summary: string;
  body: string[];
  stats: Stat[];
  places: Place[];
  adventureSlugs: string[];
  featured?: boolean;
  image: string;
  images: string[];
  videos?: string[];
  custom?: boolean;
  lat?: number;
  lng?: number;
};

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  lede: string;
  body: string[];
  image: string;
};

export type Review = {
  name: string;
  role: string;
  quote: string;
  rating: string;
};

export type MethodPhase = {
  num: string;
  slug: string;
  title: string;
  question: string;
  body: string;
  outcome: string;
};

export function journeyImages(journey: Journey): string[] {
  const list = (journey.images?.length ? journey.images : [journey.image]).filter(Boolean);
  return list;
}

export function journeyCover(journey: Journey): string {
  return journeyImages(journey)[0] ?? "";
}

export function journeyVideos(journey: Journey): string[] {
  return (journey.videos ?? []).filter(Boolean);
}
