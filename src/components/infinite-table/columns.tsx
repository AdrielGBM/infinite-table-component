/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TextWithTooltip } from "@/components/custom/text-with-tooltip";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableColumnNumber } from "@/components/data-table/data-table-column/data-table-column-number";
import { DataTableColumnLevelIndicator } from "@/components/data-table/data-table-column/data-table-column-level-indicator";
import { DataTableColumnRegion } from "@/components/data-table/data-table-column/data-table-column-region";
import { DataTableColumnSelectCode } from "@/components/data-table/data-table-column/data-table-column-select-code";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  getTimingColor,
  getTimingLabel,
  getTimingPercentage,
  timingPhases,
} from "@/lib/request/timing";
import { cn } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { Minus } from "lucide-react";
import { HoverCardTimestamp } from "./_components/hover-card-timestamp";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnSchema } from "./schema";
import type { ColumnConfig } from "./infinite-table";

export function getColumns(config: ColumnConfig[]): ColumnDef<ColumnSchema>[] {
  return config
    .map((col) => {
      if (col.noColumn || !(col.type in columns)) return false;

      const base = columns[col.type];
      return {
        ...base,
        id: col.id,
        accessorKey: "accessorKey" in base && col.id,
        label: col.label ?? col.id,
        header:
          base.header &&
          base.header !== "" &&
          (typeof base.header === "function"
            ? (props: any) =>
                (base.header as Function)({
                  ...props,
                  column: { ...props.column, label: col.label ?? col.id },
                })
            : col.label ?? base.label),
        size: col.columnSize ?? base.size,
        minSize: col.columnSize ?? base.size,
        cell:
          "cell" in base && typeof base.cell === "function"
            ? (props: any) =>
                (base.cell as Function)({
                  ...props,
                  column: {
                    ...props.column,
                    options: col.options ?? undefined,
                    colors: col.colors ?? undefined,
                    left: col.left ?? undefined,
                    right: col.right ?? undefined,
                  },
                })
            : "cell" in base
            ? base.cell
            : undefined,
      };
    })
    .filter(Boolean) as ColumnDef<ColumnSchema>[];
}

const columns: Record<
  string,
  Partial<ColumnDef<ColumnSchema>> & { label: string }
> = {
  string: {
    accessorKey: "string",
    label: "string",
    header: "String",
    cell: ({ row, column }) => {
      const value = row.getValue<ColumnSchema["string"]>(column.id);
      return <TextWithTooltip text={value ?? ""} />;
    },
    size: 130,
    minSize: 130,
    meta: {
      cellClassName:
        "font-mono w-(--col-string-size) max-w-(--col-string-size)",
      headerClassName: "min-w-(--header-string-size) w-(--header-string-size)",
    },
  },
  select: {
    accessorKey: "select",
    label: "select",
    header: "Select",
    cell: ({ row, column }) => {
      const value = row.getValue<ColumnSchema["select"]>(column.id);
      const idx =
        "options" in column && Array.isArray(column.options)
          ? (column.options as string[]).indexOf(value)
          : -1;
      const color =
        idx !== -1 && "colors" in column && Array.isArray(column.colors)
          ? (column.colors as string[])[idx]
          : undefined;
      return (
        <DataTableColumnSelectCode value={value} color={color ?? "default"} />
      );
    },
    filterFn: "arrIncludesSome",
    enableResizing: false,
    size: 69,
    minSize: 69,
    meta: {
      cellClassName:
        "font-mono w-(--col-select-size) max-w-(--col-select-size) min-w-(--col-select-size)",
      headerClassName:
        "w-(--header-select-size) max-w-(--header-select-size) min-w-(--header-select-size)",
    },
  },
  date: {
    accessorKey: "date",
    label: "date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "Date"}
      />
    ),
    cell: ({ row, column }) => {
      const date = new Date(row.getValue<ColumnSchema["date"]>(column.id));
      return <HoverCardTimestamp date={date} />;
    },
    filterFn: "inDateRange",
    enableResizing: false,
    size: 200,
    minSize: 200,
    meta: {
      headerClassName:
        "w-(--header-date-size) max-w-(--header-date-size) min-w-(--header-date-size)",
      cellClassName:
        "font-mono w-(--col-date-size) max-w-(--col-date-size) min-w-(--col-date-size)",
    },
  },
  number: {
    accessorKey: "number",
    label: "number",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "Number"}
      />
    ),
    cell: ({ row, column }) => {
      const value = row.getValue<ColumnSchema["number"]>(column.id);
      return (
        <DataTableColumnNumber
          left={
            "left" in column && typeof column.left == "string"
              ? column.left
              : undefined
          }
          value={value}
          right={
            "right" in column && typeof column.right == "string"
              ? column.right
              : undefined
          }
        />
      );
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      headerClassName:
        "w-(--header-number-size) max-w-(--header-number-size) min-w-(--header-number-size)",
      cellClassName:
        "font-mono w-(--col-number-size) max-w-(--col-number-size) min-w-(--col-number-size)",
    },
  },
  level: {
    accessorKey: "level",
    label: "level",
    header: "",
    cell: ({ row }) => {
      const level = row.getValue<ColumnSchema["level"]>("level");
      return <DataTableColumnLevelIndicator value={level} />;
    },
    enableHiding: false,
    enableResizing: false,
    filterFn: "arrSome",
    size: 27,
    minSize: 27,
    maxSize: 27,
    meta: {
      headerClassName:
        "w-(--header-level-size) max-w-(--header-level-size) min-w-(--header-level-size)",
      cellClassName:
        "w-(--col-level-size) max-w-(--col-level-size) min-w-(--col-level-size)",
    },
  },
  uuid: {
    id: "uuid",
    accessorKey: "uuid",
    label: "uuid",
    header: "Request Id",
    cell: ({ row }) => {
      const value = row.getValue<ColumnSchema["uuid"]>("uuid");
      return <TextWithTooltip text={value} />;
    },
    size: 130,
    minSize: 130,
    meta: {
      label: "Request Id",
      cellClassName:
        "font-mono w-(--col-uuid-size) max-w-(--col-uuid-size) min-w-(--col-uuid-size)",
      headerClassName:
        "min-w-(--header-uuid-size) w-(--header-uuid-size) max-w-(--header-uuid-size)",
    },
  },
  regions: {
    accessorKey: "regions",
    label: "regions",
    header: "Region",
    cell: ({ row }) => {
      const value = row.getValue<ColumnSchema["regions"]>("regions");
      if (Array.isArray(value)) {
        if (value.length > 1) {
          return (
            <div className="text-muted-foreground">{value.join(", ")}</div>
          );
        } else {
          return (
            <div className="whitespace-nowrap">
              <DataTableColumnRegion value={value[0]} />
            </div>
          );
        }
      }
      if (typeof value === "string") {
        return <DataTableColumnRegion value={value} />;
      }
      return <Minus className="h-4 w-4 text-muted-foreground/50" />;
    },
    filterFn: "arrIncludesSome",
    enableResizing: false,
    size: 163,
    minSize: 163,
    meta: {
      headerClassName:
        "w-(--header-regions-size) max-w-(--header-regions-size) min-w-(--header-regions-size)",
      cellClassName:
        "font-mono w-(--col-regions-size) max-w-(--col-regions-size) min-w-(--col-regions-size)",
    },
  },
  timing: {
    accessorKey: "timing",
    label: "timing",
    header: ({ column }) => (
      <div className="whitespace-nowrap">
        {"label" in column ? String(column.label) : "Timing Phases"}
      </div>
    ),
    cell: ({ row }) => {
      const timing = {
        "timing.dns": row.getValue<ColumnSchema["timing.dns"]>("timing.dns"),
        "timing.connection":
          row.getValue<ColumnSchema["timing.connection"]>("timing.connection"),
        "timing.tls": row.getValue<ColumnSchema["timing.tls"]>("timing.tls"),
        "timing.ttfb": row.getValue<ColumnSchema["timing.ttfb"]>("timing.ttfb"),
        "timing.transfer":
          row.getValue<ColumnSchema["timing.transfer"]>("timing.transfer"),
      };
      const latency = row.getValue<ColumnSchema["latency"]>("latency");
      const percentage = getTimingPercentage(timing, latency);
      // TODO: create a separate component for this in _components
      return (
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger
            className="opacity-70 hover:opacity-100 data-[state=open]:opacity-100"
            asChild
          >
            <div className="flex">
              {Object.entries(timing).map(([key, value]) => (
                <div
                  key={key}
                  className={cn(
                    getTimingColor(key as keyof typeof timing),
                    "h-4"
                  )}
                  style={{ width: String((value / latency) * 100) + "%" }}
                />
              ))}
            </div>
          </HoverCardTrigger>
          {/* REMINDER: allows us to port the content to the document.body, which is helpful when using opacity-50 on the row element */}
          <HoverCardPortal>
            <HoverCardContent
              side="bottom"
              align="end"
              className="z-10 w-auto p-2"
            >
              <div className="flex flex-col gap-1">
                {timingPhases.map((phase) => {
                  const color = getTimingColor(phase);
                  const percentageValue = percentage[phase];
                  return (
                    <div key={phase} className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className={cn(color, "h-2 w-2 rounded-full")} />
                        <div className="font-mono uppercase text-accent-foreground">
                          {getTimingLabel(phase)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-mono text-muted-foreground">
                          {percentageValue}
                        </div>
                        <div className="font-mono">
                          {new Intl.NumberFormat("en-US", {
                            maximumFractionDigits: 3,
                          }).format(timing[phase])}
                          <span className="text-muted-foreground">ms</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </HoverCardContent>
          </HoverCardPortal>
        </HoverCard>
      );
    },
    enableResizing: false,
    size: 130,
    minSize: 130,
    meta: {
      label: "Timing Phases",
      headerClassName:
        "w-(--header-timing-size) max-w-(--header-timing-size) min-w-(--header-timing-size)",
      cellClassName:
        "font-mono w-(--col-timing-size) max-w-(--col-timing-size) min-w-(--col-timing-size)",
    },
  },
  timing_dns: {
    id: "timing.dns",
    label: "timing.dns",
    accessorFn: (row) => row["timing.dns"],
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "DNS"}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ColumnSchema["timing.dns"]>("timing.dns");
      return <DataTableColumnNumber value={value} />;
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      label: "DNS",
      headerClassName:
        "w-(--header-timing-dns-size) max-w-(--header-timing-dns-size) min-w-(--header-timing-dns-size)",
      cellClassName:
        "font-mono w-(--col-timing-dns-size) max-w-(--col-timing-dns-size) min-w-(--col-timing-dns-size)",
    },
  },
  timing_connection: {
    id: "timing.connection",
    label: "timing.connection",
    accessorFn: (row) => row["timing.connection"],
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "Connection"}
      />
    ),
    cell: ({ row }) => {
      const value =
        row.getValue<ColumnSchema["timing.connection"]>("timing.connection");
      return <DataTableColumnNumber value={value} />;
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      label: "Connection",
      headerClassName:
        "w-(--header-timing-connection-size) max-w-(--header-timing-connection-size) min-w-(--header-timing-connection-size)",
      cellClassName:
        "font-mono w-(--col-timing-connection-size) max-w-(--col-timing-connection-size) min-w-(--col-timing-connection-size)",
    },
  },
  timing_tls: {
    id: "timing.tls",
    label: "timing.tls",
    accessorFn: (row) => row["timing.tls"],
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "TLS"}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ColumnSchema["timing.tls"]>("timing.tls");
      return <DataTableColumnNumber value={value} />;
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      label: "TLS",
      headerClassName:
        "w-(--header-timing-tls-size) max-w-(--header-timing-tls-size) min-w-(--header-timing-tls-size)",
      cellClassName:
        "font-mono w-(--col-timing-tls-size) max-w-(--col-timing-tls-size) min-w-(--col-timing-tls-size)",
    },
  },
  timing_ttfb: {
    id: "timing.ttfb",
    label: "timing.ttfb",
    accessorFn: (row) => row["timing.ttfb"],
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "TTFB"}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ColumnSchema["timing.ttfb"]>("timing.ttfb");
      return <DataTableColumnNumber value={value} />;
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      label: "TTFB",
      headerClassName:
        "w-(--header-timing-ttfb-size) max-w-(--header-timing-ttfb-size) min-w-(--header-timing-ttfb-size)",
      cellClassName:
        "font-mono w-(--col-timing-ttfb-size) max-w-(--col-timing-ttfb-size) min-w-(--col-timing-ttfb-size)",
    },
  },
  timing_transfer: {
    id: "timing.transfer",
    label: "timing.transfer",
    accessorFn: (row) => row["timing.transfer"],
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"label" in column ? String(column.label) : "Transfer"}
      />
    ),
    cell: ({ row }) => {
      const value =
        row.getValue<ColumnSchema["timing.transfer"]>("timing.transfer");
      return <DataTableColumnNumber value={value} />;
    },
    filterFn: "inNumberRange",
    enableResizing: false,
    size: 110,
    minSize: 110,
    meta: {
      label: "Transfer",
      headerClassName:
        "w-(--header-timing-transfer-size) max-w-(--header-timing-transfer-size) min-w-(--header-timing-transfer-size)",
      cellClassName:
        "font-mono w-(--col-timing-transfer-size) max-w-(--col-timing-transfer-size) min-w-(--col-timing-transfer-size)",
    },
  },
};
