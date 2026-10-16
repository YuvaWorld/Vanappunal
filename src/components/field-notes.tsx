import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function inline(text: string) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const raw = m[0];
    if (raw.startsWith("**")) parts.push(<strong key={i++}>{raw.slice(2, -2)}</strong>);
    else parts.push(<em key={i++}>{raw.slice(1, -1)}</em>);
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function parseNotes(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    const text = para.join(" ").replace(/\s+/g, " ").trim();
    para = [];
    if (text) blocks.push({ type: "p", text });
  };
  const flushList = () => {
    if (list && list.items.length) blocks.push(list);
    list = null;
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*(?:[-*•]|\u2022)\s+(.+)/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)/);
    if (bullet) {
      flushPara();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(bullet[1].trim());
      continue;
    }
    if (numbered) {
      flushPara();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(numbered[1].trim());
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

export function FieldNotes({ text, className }: { text: string; className?: string }) {
  const blocks = parseNotes(text);
  if (!blocks.length) return null;
  return (
    <div className={className ?? "notes"}>
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i} className="mt-5 text-base leading-relaxed text-muted first:mt-0 md:text-lg">
              {inline(b.text)}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted md:text-lg">
              {b.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={i} className="mt-5 list-decimal space-y-2 pl-5 text-base leading-relaxed text-muted md:text-lg">
            {b.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
