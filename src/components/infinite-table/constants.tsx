import { CopyToClipboardContainer } from "@/components/custom/copy-to-clipboard-container";
import { KVTabs } from "@/components/custom/kv-tabs";
import { DataTableColumnRegion } from "@/components/data-table/data-table-column/data-table-column-region";
import type {
  DataTableFilterField,
  Option,
  SheetField,
} from "@/components/data-table/types";
import { LEVELS } from "@/constants/levels";
import { REGIONS } from "@/constants/region";
import { formatMilliseconds } from "@/lib/format";
import { getLevelColor, getLevelLabel } from "@/lib/request/level";
import { getStatusColor } from "@/lib/request/status-code";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PopoverPercentile } from "./_components/popover-percentile";
import { SheetTimingPhases } from "./_components/sheet-timing-phases";
import type { LogsMeta } from "./query-options";
import { type ColumnSchema } from "./schema";
import type { ColumnConfig } from "./infinite-table";
import type { Percentile } from "@/lib/request/percentile";

// instead of filterFields, maybe just 'fields' with a filterDisabled prop?
// that way, we could have 'message' or 'headers' field with label and value as well as type!

export function getFilterFields(
  config: ColumnConfig[]
): DataTableFilterField<ColumnSchema>[] {
  return config
    .map((col) => {
      if (col.noFilter || !(col.type in filterFields)) return false;

      const base = filterFields[col.type as keyof typeof filterFields];
      return {
        ...base,
        label: col.label ?? col.id,
        value: col.id,
        options:
          "options" in base
            ? col.type === "select" && col.options
              ? col.options.map((option: string) => ({
                  label: option,
                  value: option,
                }))
              : base.options
            : undefined,
      };
    })
    .filter(Boolean) as DataTableFilterField<ColumnSchema>[];
}

const filterFields = {
  string: {
    label: "String",
    value: "string",
    type: "input",
  },
  select: {
    label: "Select",
    value: "select",
    type: "checkbox",
    options: [].map((option) => ({ label: option, value: option })),
    component: (props: Option) => {
      return <span className="font-mono">{props.value}</span>;
    },
  },
  date: {
    label: "Time Range",
    value: "date",
    type: "timerange",
    defaultOpen: true,
    commandDisabled: true,
  },
  level: {
    label: "Level",
    value: "level",
    type: "checkbox",
    defaultOpen: true,
    options: LEVELS.map((level) => ({ label: level, value: level })),
    component: (props: Option) => {
      // TODO: type `Option` with `options` values via Generics
      const value = props.value as (typeof LEVELS)[number];
      return (
        <div className="flex w-full max-w-28 items-center justify-between gap-2 font-mono">
          <span className="capitalize text-foreground/70 group-hover:text-accent-foreground">
            {props.label}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-[2px]",
                getLevelColor(value).bg
              )}
            />
            <span className="text-xs text-muted-foreground/70">
              {getLevelLabel(value)}
            </span>
          </div>
        </div>
      );
    },
  },
  status: {
    label: "Status Code",
    value: "status",
    type: "checkbox",
    options: [
      { label: "200", value: 200 },
      { label: "400", value: 400 },
      { label: "404", value: 404 },
      { label: "500", value: 500 },
    ], // REMINDER: this is a placeholder to set the type in the client.tsx
    component: (props: Option) => {
      if (typeof props.value === "boolean") return null;
      if (typeof props.value === "undefined") return null;
      if (typeof props.value === "string") return null;
      return (
        <span className={cn("font-mono", getStatusColor(props.value).text)}>
          {props.value}
        </span>
      );
    },
  },
  regions: {
    label: "Regions",
    value: "regions",
    type: "checkbox",
    options: REGIONS.map((region) => ({ label: region, value: region })),
    component: (props: Option) => {
      return <span className="font-mono">{props.value}</span>;
    },
  },
  latency: {
    label: "Latency",
    value: "latency",
    type: "slider",
    min: 0,
    max: 5000,
  },
  timing_dns: {
    label: "DNS",
    value: "timing.dns",
    type: "slider",
    min: 0,
    max: 5000,
  },
  timing_connection: {
    label: "Connection",
    value: "timing.connection",
    type: "slider",
    min: 0,
    max: 5000,
  },
  timing_tls: {
    label: "TLS",
    value: "timing.tls",
    type: "slider",
    min: 0,
    max: 5000,
  },
  timing_ttfb: {
    label: "TTFB",
    value: "timing.ttfb",
    type: "slider",
    min: 0,
    max: 5000,
  },
  timing_transfer: {
    label: "Transfer",
    value: "timing.transfer",
    type: "slider",
    min: 0,
    max: 5000,
  },
};

export function getSheetFields(
  config: ColumnConfig[]
): SheetField<ColumnSchema, LogsMeta>[] {
  return config
    .map((col) => {
      if (col.noSheet || !(col.type in sheetFields)) return false;

      const base = sheetFields[col.type as keyof typeof sheetFields];
      return {
        ...base,
        id: col.id,
        label: col.label ?? col.id,
        skeletonClassName:
          "skeletonClassName" in base
            ? col.sheetClassName ?? base.skeletonClassName
            : undefined,
        className:
          "className" in base
            ? col.sheetClassName ?? base.className
            : undefined,
        component:
          "component" in base && typeof base.component === "function"
            ? (props: Record<string, unknown>) =>
                base.component({
                  ...props,
                  id: col.id,
                }) // TODO: Este error se solucionará al volver dinámicos todos los types
            : undefined,
      };
    })
    .filter(Boolean) as SheetField<ColumnSchema, LogsMeta>[];
}

const sheetFields = {
  string: {
    id: "string",
    label: "String",
    type: "input",
    skeletonClassName: "w-56",
  },
  select: {
    id: "select",
    label: "Select",
    type: "checkbox",
    component: (props: Record<string, unknown> & { id?: string }) => {
      return (
        <span className="font-mono">{String(props[props.id ?? "select"])}</span>
      );
    },
    skeletonClassName: "w-10",
  },
  uuid: {
    id: "uuid",
    label: "Request ID",
    type: "readonly",
    skeletonClassName: "w-64",
  },
  date: {
    id: "date",
    label: "Date",
    type: "timerange",
    component: (props: { date: string | number | Date }) =>
      format(new Date(props.date), "LLL dd, y HH:mm:ss"),
    skeletonClassName: "w-36",
  },
  status: {
    id: "status",
    label: "Status",
    type: "checkbox",
    component: (props: { status: number }) => {
      return (
        <span className={cn("font-mono", getStatusColor(props.status).text)}>
          {props.status}
        </span>
      );
    },
    skeletonClassName: "w-12",
  },
  regions: {
    id: "regions",
    label: "Regions",
    type: "checkbox",
    skeletonClassName: "w-12",
    component: (props: { regions: string[] }) => (
      <DataTableColumnRegion value={props.regions[0]} reverse showFlag />
    ),
  },
  latency: {
    id: "latency",
    label: "Latency",
    type: "slider",
    component: (props: { latency: number }) => (
      <>
        {formatMilliseconds(props.latency)}
        <span className="text-muted-foreground">ms</span>
      </>
    ),
    skeletonClassName: "w-16",
  },
  percentile: {
    id: "percentile",
    label: "Percentile",
    type: "readonly",
    component: (
      props: ColumnSchema & {
        metadata?: {
          currentPercentiles?: Record<Percentile, number>;
          filterRows?: number;
        };
      }
    ) => {
      return (
        <PopoverPercentile
          data={props}
          percentiles={props.metadata?.currentPercentiles}
          filterRows={props.metadata?.filterRows ?? 0}
          className="ml-auto"
        />
      );
    },
    skeletonClassName: "w-12",
  },
  timing_dns: {
    id: "timing.dns", // REMINDER: cannot be 'timing' as it is a property of the object
    label: "Timing Phases",
    type: "readonly",
    component: (
      props: Record<
        | "timing.dns"
        | "timing.connection"
        | "timing.tls"
        | "timing.ttfb"
        | "timing.transfer",
        number
      > & { latency: number }
    ) => <SheetTimingPhases latency={props.latency} timing={props} />,
    className: "flex-col items-start w-full gap-1",
  },
  headers: {
    id: "headers",
    label: "Headers",
    type: "readonly",
    component: (props: { headers: Record<string, string> }) => (
      // REMINDER: negative margin to make it look like the header is on the same level of the tab triggers
      <KVTabs data={props.headers} className="-mt-[22px]" />
    ),
    className: "flex-col items-start w-full gap-1",
  },
  message: {
    id: "message",
    label: "Message",
    type: "readonly",
    condition: (props: { message?: string }) => props.message !== undefined,
    component: (props: { message?: string }) => (
      <CopyToClipboardContainer variant="destructive">
        {JSON.stringify(props.message, null, 2)}
      </CopyToClipboardContainer>
    ),
    className: "flex-col items-start w-full gap-1",
  },
};
