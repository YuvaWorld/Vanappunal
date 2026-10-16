import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        solid:
          "bg-accent text-accent-fg hover:bg-fg rounded-sm px-5 py-3 text-sm",
        ghost:
          "bg-transparent text-fg border border-border hover:border-line hover:bg-bg-elevated rounded-sm px-5 py-3 text-sm",
        arrow:
          "bg-transparent text-fg hover:text-accent px-0 py-0 rounded-none gap-3 text-sm uppercase tracking-[0.18em]",
      },
      size: {
        default: "",
        lg: "px-6 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "solid", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
