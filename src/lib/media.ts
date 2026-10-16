import { useEffect, useState } from "react";

const DB_NAME = "averune-media";
const STORE = "files";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function isRemoteSrc(src: string) {
  return (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  );
}

export async function saveMediaBlob(blob: Blob): Promise<string> {
  const id = `media-${crypto.randomUUID()}`;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return id;
}

export async function deleteMedia(id: string) {
  if (isRemoteSrc(id)) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function readMediaUrl(id: string): Promise<string | null> {
  if (!id) return null;
  if (isRemoteSrc(id)) return id;
  const db = await openDb();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export function useMediaUrl(src?: string) {
  const [url, setUrl] = useState(() => (src && isRemoteSrc(src) ? src : ""));

  useEffect(() => {
    if (!src) {
      setUrl("");
      return;
    }
    if (isRemoteSrc(src)) {
      setUrl(src);
      return;
    }
    let live = true;
    let objectUrl: string | null = null;
    void readMediaUrl(src).then((next) => {
      if (!live) return;
      if (next?.startsWith("blob:")) objectUrl = next;
      setUrl(next ?? "");
    });
    return () => {
      live = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return url;
}
