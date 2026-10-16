import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  to: string;
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string>;
};

export function ArrowLink({ to, children, className, params }: Props) {
  return (
    <Link
      to={to as never}
      params={params as never}
      data-cursor
      className={cn(
        "group inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-fg",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </span>
      <span aria-hidden className="arrow-pair text-muted group-hover:text-fg">
        <span>→</span>
        <span className="-ml-[1em]">→</span>
      </span>
    </Link>
  );
}
