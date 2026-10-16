export type VideoKind = "youtube" | "vimeo" | "file";

export type ParsedVideo = {
  kind: VideoKind;
  url: string;
  embed: string;
};

const YT =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
const VIMEO = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i;

export function parseVideo(raw: string): ParsedVideo | null {
  const url = raw.trim();
  if (!url) return null;
  const yt = url.match(YT);
  if (yt?.[1]) {
    return {
      kind: "youtube",
      url,
      embed: `https://www.youtube.com/embed/${yt[1]}?rel=0`,
    };
  }
  const vimeo = url.match(VIMEO);
  if (vimeo?.[1]) {
    return {
      kind: "vimeo",
      url,
      embed: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }
  if (
    url.startsWith("data:video/") ||
    /\.(mp4|webm|ogg)(\?|$)/i.test(url) ||
    url.startsWith("https://") && url.includes("video")
  ) {
    return { kind: "file", url, embed: url };
  }
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return { kind: "file", url, embed: url };
  }
  return null;
}

export function cleanVideos(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [] as string[];
  return input
    .filter((src): src is string => typeof src === "string" && Boolean(parseVideo(src)))
    .filter((src) => src.length < 2_400_000)
    .slice(0, max);
}
