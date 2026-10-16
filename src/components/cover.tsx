import { useMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function Cover({
  src,
  alt,
  className,
  ken,
  clip = true,
  hero,
}: {
  src: string;
  alt: string;
  className?: string;
  ken?: boolean;
  clip?: boolean;
  hero?: boolean;
}) {
  const url = useMediaUrl(src);
  return (
    <div
      className={cn("cover-zoom overflow-hidden bg-bg-subtle", className)}
      data-clip={clip ? (hero ? "hero" : "true") : undefined}
    >
      {url ? (
        <img src={url} alt={alt} className={cn("size-full object-cover", ken && "hero-ken origin-center")} />
      ) : (
        <div className="size-full bg-gradient-to-br from-[#1a1a16] to-[#0c0c0b]" />
      )}
    </div>
  );
}
