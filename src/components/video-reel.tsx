import { useMediaUrl } from "@/lib/media";

export function VideoReel({ videos, title }: { videos: string[]; title: string }) {
  if (!videos.length) return null;
  return (
    <section className="border-t border-border px-4 py-12 sm:px-5 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-xs uppercase tracking-[0.22em] text-muted">
          Videos
        </p>
        <div className={`mt-8 grid gap-6 ${videos.length > 1 ? "md:grid-cols-2" : ""}`}>
          {videos.map((src, i) => (
            <Clip key={`${src}-${i}`} src={src} title={`${title} ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Clip({ src, title }: { src: string; title: string }) {
  const url = useMediaUrl(src);
  if (!url) return <div className="aspect-video rounded-lg bg-bg-subtle" />;
  return (
    <div data-clip className="overflow-hidden rounded-lg bg-bg-subtle">
      <video className="aspect-video w-full bg-bg" src={url} controls playsInline preload="metadata">
        {title}
      </video>
    </div>
  );
}
