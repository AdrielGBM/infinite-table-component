import { Bar, BarChart, CartesianGrid, ReferenceArea, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useDataTable } from "@/components/data-table/useDataTable";
import type { BaseChartSchema } from "./schema";
import type { ColumnConfig, SelectColumnConfig } from "./config-types";
import { getColor } from "@/lib/request/colors";

export const description = "A stacked bar chart";

interface TimelineChartProps<TChart extends BaseChartSchema> {
  className?: string;
  /**
   * The table column id to filter by - needs to be a type of `timerange` (e.g. "date").
   * TBD: if using keyof TData to be closer to the data table props
   */
  columnId: string;
  /**
   * Same data as of the InfiniteQueryMeta.
   */
  data: TChart[];
  /**
   * Column configuration to determine chart structure
   */
  columnConfig?: ColumnConfig[];
}

export function TimelineChart<TChart extends BaseChartSchema>({
  data,
  className,
  columnId,
  columnConfig = [],
}: TimelineChartProps<TChart>) {
  const { table } = useDataTable();
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const mainChartColumn = useMemo(() => {
    return columnConfig.find(
      (col): col is SelectColumnConfig =>
        col.type === "select" && "chartMain" in col && col.chartMain === true
    );
  }, [columnConfig]);

  const chartLevels = useMemo(() => {
    if (!mainChartColumn?.options) {
      return [
        { value: "error", color: "red", label: "Error" },
        { value: "warning", color: "orange", label: "Warning" },
        { value: "success", color: "green", label: "Success" },
      ];
    }

    return mainChartColumn.options.map((option) => ({
      value: option.value,
      color: option.color ?? "default",
      label: option.label ?? option.value,
    }));
  }, [mainChartColumn]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartLevels.forEach((level) => {
      config[level.value] = {
        label: level.label,
        color: `hsl(var(--color-${level.color}))`,
      };
    });
    return config;
  }, [chartLevels]);

  // REMINDER: date has to be a string for tooltip label to work - don't ask me why
  const chart = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        [columnId]: new Date(item.timestamp).toString(),
      })),
    [data, columnId]
  );

  const timerange = useMemo(() => {
    if (data.length === 0) return { interval: 0, period: undefined };
    const first = data[0].timestamp;
    const last = data[data.length - 1].timestamp;
    const interval = Math.abs(first - last); // in ms
    return { interval, period: calculatePeriod(interval) };
  }, [data]);

  const handleMouseDown: CategoricalChartFunc = (e) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove: CategoricalChartFunc = (e) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp: CategoricalChartFunc = () => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      table
        .getColumn(columnId)
        ?.setFilterValue([new Date(left), new Date(right)]);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "aspect-auto h-[60px] w-full",
        "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/50", // otherwise same color as 200
        "select-none", // disable text selection
        className
      )}
    >
      <BarChart
        accessibilityLayer
        data={chart}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: "crosshair" }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={columnId}
          tickLine={false}
          minTickGap={32}
          axisLine={false}
          // interval="preserveStartEnd"
          tickFormatter={(value: string | number | Date) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "N/A";
            if (timerange.period === "10m") {
              return format(date, "HH:mm:ss");
            } else if (timerange.period === "1d") {
              return format(date, "HH:mm");
            } else if (timerange.period === "1w") {
              return format(date, "LLL dd HH:mm");
            }
            return format(date, "LLL dd, y");
          }}
        />
        <ChartTooltip
          // defaultIndex={10}
          content={
            <ChartTooltipContent
              labelFormatter={(value: string | number | Date) => {
                const date = new Date(value);
                if (isNaN(date.getTime())) return "N/A";
                if (timerange.period === "10m") {
                  return format(date, "LLL dd, HH:mm:ss");
                }
                return format(date, "LLL dd, y HH:mm");
              }}
            />
          }
        />
        {chartLevels.map((level) => (
          <Bar
            key={level.value}
            dataKey={level.value}
            stackId="a"
            fill={getColor(level.color).hex}
          />
        ))}
        {refAreaLeft && refAreaRight && (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            fill="var(--foreground)"
            fillOpacity={0.08}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}

// TODO: check what's a good abbreviation for month vs. minutes
function calculatePeriod(interval: number): "10m" | "1d" | "1w" | "1mo" {
  if (interval <= 1000 * 60 * 10) {
    // less than 10 minutes
    return "10m";
  } else if (interval <= 1000 * 60 * 60 * 24) {
    // less than 1 day
    return "1d";
  } else if (interval <= 1000 * 60 * 60 * 24 * 7) {
    // less than 1 week
    return "1w";
  }
  return "1mo"; // defaults to 1 month
}
