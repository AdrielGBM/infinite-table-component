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
import { DataTableColumnSelectCode } from "@/components/data-table/data-table-column/data-table-column-select-code";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getTimelinePercentage } from "@/lib/request/timeline";
import { cn } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { HoverCardTimestamp } from "./_components/hover-card-timestamp";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnSchema } from "./schema";
import type { ColumnConfig } from "./infinite-table";
import { getColor } from "@/lib/request/colors";
import { formatMilliseconds } from "@/lib/format";

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
                    labels: col.labels ?? undefined,
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

      const getOptionalData = (val: string) => {
        const idx =
          "options" in column && Array.isArray(column.options)
            ? (column.options as string[]).indexOf(val)
            : -1;
        const color =
          idx !== -1 && "colors" in column && Array.isArray(column.colors)
            ? (column.colors as (string | null)[])[idx]
            : undefined;
        const label =
          idx !== -1 && "labels" in column && Array.isArray(column.labels)
            ? (column.labels as (string | null)[])[idx]
            : undefined;
        return { label, color: color ?? "default" };
      };

      if (Array.isArray(value)) {
        return (
          <>
            {value.map((val, i) => {
              const { label, color } = getOptionalData(val);
              return (
                <DataTableColumnSelectCode
                  key={val + String(i)}
                  value={val + (!label && i < value.length - 1 ? ", " : "")}
                  label={
                    label
                      ? label + (i < value.length - 1 ? ", " : "")
                      : undefined
                  }
                  color={color}
                />
              );
            })}
          </>
        );
      } else {
        const { label, color } = getOptionalData(value);
        return (
          <DataTableColumnSelectCode
            value={value}
            label={label}
            color={color}
          />
        );
      }
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
  timeline: {
    accessorKey: "timeline",
    label: "timeline",
    header: ({ column }) => (
      <div className="whitespace-nowrap">
        {"label" in column ? String(column.label) : "Timeline"}
      </div>
    ),
    cell: ({ row, column }) => {
      const options =
        "options" in column && Array.isArray(column.options)
          ? (column.options as string[])
          : [];
      const labels =
        "labels" in column && Array.isArray(column.labels)
          ? (column.labels as string[])
          : [];
      const colors =
        "colors" in column && Array.isArray(column.colors)
          ? (column.colors as string[])
          : [];
      const values =
        options.length > 0
          ? options.map((key) => row.getValue<ColumnSchema["number"]>(key))
          : [];
      const total = values.reduce((acc, curr) => acc + curr, 0);
      const percentage = getTimelinePercentage(values, total);
      return (
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger
            className="opacity-70 hover:opacity-100 data-[state=open]:opacity-100"
            asChild
          >
            <div className="flex">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className={cn(getColor(colors[idx]).shape, "h-4")}
                  style={{ width: String((value / total) * 100) + "%" }}
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
                {values.map((value, idx) => {
                  return (
                    <div key={idx} className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            getColor(colors[idx]).shape,
                            "h-2 w-2 rounded-full"
                          )}
                        />
                        <div className="font-mono uppercase text-accent-foreground">
                          {labels[idx] ?? options[idx]}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-mono text-muted-foreground">
                          {percentage[idx]}
                        </div>
                        <div className="font-mono">
                          {"left" in column &&
                            typeof column.left === "string" && (
                              <span className="text-muted-foreground">
                                {column.left}
                              </span>
                            )}
                          {formatMilliseconds(value)}
                          {"right" in column &&
                            typeof column.right === "string" && (
                              <span className="text-muted-foreground">
                                {column.right}
                              </span>
                            )}
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
      headerClassName:
        "w-(--header-timeline-size) max-w-(--header-timeline-size) min-w-(--header-timeline-size)",
      cellClassName:
        "font-mono w-(--col-timeline-size) max-w-(--col-timeline-size) min-w-(--col-timeline-size)",
    },
  },
};
