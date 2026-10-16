import { useSyncExternalStore } from "react";

export type SiteProfile = {
  portrait: string;
};

const KEY = "averune-site-v1";
const EMPTY: SiteProfile = { portrait: "" };

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshot: SiteProfile = EMPTY;
let rawCache: string | null = null;

function read(): SiteProfile {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  if (!raw) {
    snapshot = EMPTY;
    return snapshot;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<SiteProfile>;
    snapshot = { portrait: typeof parsed.portrait === "string" ? parsed.portrait : "" };
  } catch {
    snapshot = EMPTY;
  }
  return snapshot;
}

function write(next: SiteProfile) {
  snapshot = next.portrait ? next : EMPTY;
  rawCache = snapshot === EMPTY ? null : JSON.stringify(snapshot);
  if (rawCache) localStorage.setItem(KEY, rawCache);
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function getSiteProfile() {
  return read();
}

export function setSitePortrait(portrait: string) {
  write({ portrait });
}

export function subscribeSite(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useSiteProfile() {
  return useSyncExternalStore(subscribeSite, getSiteProfile, () => EMPTY);
}
