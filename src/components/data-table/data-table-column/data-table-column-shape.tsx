import { getColor } from "@/lib/request/colors";
import { cn } from "@/lib/utils";

export function DataTableColumnShape({ color }: { color?: string }) {
  return (
    <div className={cn("flex items-center justify-center")}>
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-[2px]",
          getColor(color ?? "default").shape
        )}
      />
    </div>
  );
}
