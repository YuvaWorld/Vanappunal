import { useMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const url = useMediaUrl(src);
  if (!url) return <div className={cn("bg-bg-subtle", className)} />;
  return <img src={url} alt={alt} className={className} />;
}
