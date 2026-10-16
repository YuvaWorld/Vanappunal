const files = import.meta.glob("../../content/news/*.json", { eager: true, import: "default" });

export type NewsKind = "news" | "launch" | "site";

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  kind: NewsKind;
  summary: string;
  url: string;
  image: string;
};

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function kindOf(v: unknown): NewsKind {
  const s = asString(v).toLowerCase();
  if (s === "launch") return "launch";
  if (s === "site") return "site";
  return "news";
}

export function cmsNews(): NewsItem[] {
  const out: NewsItem[] = [];
  for (const [path, raw] of Object.entries(files)) {
    const row = (raw ?? {}) as Record<string, unknown>;
    const title = asString(row.title);
    if (!title) continue;
    const slug = asString(row.slug) || path.split("/").pop()?.replace(/\.json$/i, "") || "update";
    out.push({
      slug,
      title,
      date: asString(row.date),
      kind: kindOf(row.kind),
      summary: asString(row.summary) || asString(row.body),
      url: asString(row.url),
      image: asString(row.image),
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const newsKindLabel: Record<NewsKind, string> = {
  news: "News",
  launch: "Launch",
  site: "New site",
};
