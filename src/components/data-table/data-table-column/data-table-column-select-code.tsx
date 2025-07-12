import { getColor } from "@/lib/request/colors";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

interface DataTableColumnSelectCodeProps {
  value?: string;
  label?: string;
  color?: string;
  reverse?: boolean;
}

export function DataTableColumnSelectCode({
  value,
  label,
  color = "default",
  reverse = false,
}: DataTableColumnSelectCodeProps) {
  if (!value) {
    return <Minus className="h-4 w-4 text-muted-foreground/50" />;
  }
  const colors = getColor(color);
  return reverse ? (
    <>
      <span className="text-xs text-muted-foreground">{label}</span>
      {label ? " " : ""}
      <span className={cn("font-mono", colors.text)}>{value}</span>
    </>
  ) : (
    <>
      <span className={cn("font-mono", colors.text)}>{value}</span>
      {label ? " " : ""}
      <span className="text-xs text-muted-foreground">{label}</span>
    </>
  );
}
