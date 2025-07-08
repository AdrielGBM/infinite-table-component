import { getColor } from "@/lib/request/colors";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

export function DataTableColumnSelectCode({
  value,
  color = "default",
}: {
  value?: string;
  color?: string;
}) {
  if (!value) {
    return <Minus className="h-4 w-4 text-muted-foreground/50" />;
  }
  const colors = getColor(color);
  return <div className={cn("font-mono", colors.text)}>{value}</div>;
}
