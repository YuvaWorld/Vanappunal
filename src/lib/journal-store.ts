import { useSyncExternalStore } from "react";
import { slugify, uid } from "./utils";

export type LogPlace = {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  description: string;
  date: string;
  lat: number;
  lng: number;
  photos: string[];
  videos: string[];
};

const KEY = "averune-places-v2";
const EMPTY: LogPlace[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let snapshot: LogPlace[] = EMPTY;
let snapshotRaw: string | null = null;

function isPlace(row: unknown): row is LogPlace {
  if (!row || typeof row !== "object") return false;
  const r = row as LogPlace;
  return typeof r.id === "string" && typeof r.name === "string" && typeof r.lat === "number" && typeof r.lng === "number";
}

function parse(raw: string | null): LogPlace[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    const rows = parsed.filter(isPlace);
    return rows.length ? rows : EMPTY;
  } catch {
    return EMPTY;
  }
}

function read(): LogPlace[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY);
  if (raw === snapshotRaw) return snapshot;
  snapshotRaw = raw;
  snapshot = parse(raw);
  return snapshot;
}

function write(rows: LogPlace[]) {
  const next = rows.length ? rows : EMPTY;
  const raw = next === EMPTY ? null : JSON.stringify(next);
  if (raw) localStorage.setItem(KEY, raw);
  else localStorage.removeItem(KEY);
  snapshotRaw = raw;
  snapshot = next;
  listeners.forEach((l) => l());
}

export function listLocalPlaces(): LogPlace[] {
  return read();
}

export function upsertLocalPlace(input: Omit<LogPlace, "id" | "slug"> & { id?: string; slug?: string }) {
  const rows = [...read()];
  const slug = input.slug || uniqueSlug(slugify(input.name) || "place", rows, input.id);
  const id = input.id || uid("place");
  const next: LogPlace = { ...input, id, slug };
  const idx = rows.findIndex((r) => r.id === id || r.slug === slug);
  if (idx >= 0) rows[idx] = next;
  else rows.unshift(next);
  write(rows);
  return next;
}

export function deleteLocalPlace(id: string) {
  write(read().filter((r) => r.id !== id && r.slug !== id));
}

function uniqueSlug(base: string, rows: LogPlace[], keepId?: string) {
  let slug = base || "place";
  let n = 2;
  while (rows.some((r) => r.slug === slug && r.id !== keepId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

function emit() {
  snapshotRaw = null;
  listeners.forEach((l) => l());
}

let listening = false;

export function subscribePlaces(fn: Listener) {
  listeners.add(fn);
  if (typeof window !== "undefined" && !listening) {
    listening = true;
    window.addEventListener("storage", emit);
  }
  return () => {
    listeners.delete(fn);
  };
}

export function useLocalPlaces() {
  return useSyncExternalStore(subscribePlaces, listLocalPlaces, () => EMPTY);
}
