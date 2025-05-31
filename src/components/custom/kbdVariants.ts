import { cva } from "class-variance-authority";

export const kbdVariants = cva(
  "select-none rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal font-mono shadow-sm disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
