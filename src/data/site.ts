export const site = {
  name: "Vanappunal",
  wordmark: "VANAPPUNAL",
  tagline: "places I walked.",
  description: "Vanappunal — a personal field journal. Places walked, photographs, film.",
};

export function pageTitle(page?: string) {
  return page ? `${page} — ${site.name}` : site.name;
}
