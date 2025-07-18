import { getTimelinePercentage } from "@/lib/request/timeline";
import { cn } from "@/lib/utils";
import { formatMilliseconds } from "@/lib/format";
import { getColor } from "@/lib/request/colors";

export function SheetTimelinePhases({
  total,
  options,
  labels,
  values,
  colors,
  left,
  right,
  className,
}: {
  total: number;
  options: string[];
  labels: (string | null)[];
  values: number[];
  colors: (string | null)[];
  left?: string;
  right?: string;
  className?: string;
}) {
  const percentage = getTimelinePercentage(values, total);
  return (
    <div className={cn("space-y-1 w-full text-left", className)}>
      {options.map((option, idx) => (
        <div
          key={option}
          className="grid grid-cols-3 gap-2 text-xs justify-between items-center"
        >
          <div className="text-foreground uppercase truncate font-mono">
            {labels[idx]}
          </div>
          <div className="flex gap-2 col-span-2">
            <div className="font-mono text-muted-foreground mr-8">
              {percentage[idx]}
            </div>
            <div className="flex flex-1 gap-2 items-center justify-end">
              <div className="font-mono">
                {left && <span className="text-muted-foreground">{left}</span>}
                {formatMilliseconds(values[idx])}
                {right && (
                  <span className="text-muted-foreground">{right}</span>
                )}
              </div>
            </div>
            <div
              className={cn(getColor(colors[idx] ?? "default").bg, "h-4")}
              style={{ width: `${String((values[idx] / total) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
