import { CopyToClipboardContainer } from "@/components/custom/copy-to-clipboard-container";
import { KVTabs } from "@/components/custom/kv-tabs";
import type {
  DataTableFilterField,
  Option,
  SheetField,
} from "@/components/data-table/types";
import { LEVELS } from "@/constants/levels";
import { formatMilliseconds } from "@/lib/format";
import { getLevelColor, getLevelLabel } from "@/lib/request/level";
import { getColor } from "@/lib/request/colors";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PopoverPercentile } from "./_components/popover-percentile";
import { SheetTimelinePhases } from "./_components/sheet-timeline-phases";
import type { LogsMeta } from "./query-options";
import { type ColumnSchema } from "./schema";
import type { ColumnConfig, ColumnOption } from "./config-types";
import type { Percentile } from "@/lib/request/percentile";
import { DataTableColumnSelectCode } from "../data-table/data-table-column/data-table-column-select-code";

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
            ? col.type === "select"
              ? col.options.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))
              : base.options
            : undefined,
        min:
          "min" in base
            ? col.type === "number" && col.min
              ? col.min
              : base.min
            : undefined,
        max:
          "max" in base
            ? col.type === "number" && col.max
              ? col.max
              : base.max
            : undefined,
        component:
          (col.type === "select" || col.type === "timeline") &&
          "component" in base &&
          typeof base.component === "function"
            ? (props: Option) =>
                base.component({
                  ...props,
                  options: col.options,
                })
            : "component" in base
            ? base.component
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
    options: [],
    component: (props: Option & { options: ColumnOption[] }) => {
      const idx = props.options.findIndex(
        (option) => option.value === String(props.value)
      );
      const color =
        idx !== -1 ? props.options[idx].color ?? "default" : "default";
      return (
        <span className={cn("font-mono", getColor(color).text)}>
          {props.value}
        </span>
      );
    },
  },
  date: {
    label: "Time Range",
    value: "date",
    type: "timerange",
    defaultOpen: true,
    commandDisabled: true,
  },
  number: {
    label: "Number",
    value: "number",
    type: "slider",
    min: 0,
    max: 5000,
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
                getLevelColor(value).shape
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
};

export function getSheetFields(
  config: ColumnConfig[]
): SheetField<ColumnSchema, LogsMeta>[] {
  return config
    .map((col) => {
      if (col.noSheet || !(col.type in sheetFields)) return false;

      const base = sheetFields[col.type];
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
                  ...(col.type === "select" || col.type === "timeline"
                    ? { options: col.options }
                    : {}),
                  ...(col.type === "number" || col.type === "timeline"
                    ? {
                        left: col.left,
                        right: col.right,
                      }
                    : {}),
                  ...(col.type === "message" ? { color: col.color } : {}),
                }) // TODO: Este error se solucionará al volver dinámicos todos los types
            : "component" in base
            ? base.component
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
    component: (
      props: Record<string, unknown> & {
        id?: string;
        options: ColumnOption[];
      }
    ) => {
      const value = props[props.id ?? "select"] as
        | string
        | string[]
        | undefined;

      const getOptionalData = (val: string) => {
        const idx = props.options.findIndex((option) => option.value === val);

        const label =
          idx !== -1 ? props.options[idx].label ?? undefined : undefined;
        const color =
          idx !== -1 ? props.options[idx].color ?? "default" : "default";

        return { label, color };
      };

      if (Array.isArray(value)) {
        return (
          <>
            {value.map((val, i) => {
              const { label, color } = getOptionalData(val);
              return (
                <DataTableColumnSelectCode
                  key={val + String(i)}
                  value={val + (i < value.length - 1 ? ", " : "")}
                  label={label}
                  color={color}
                  reverse
                />
              );
            })}
          </>
        );
      } else {
        const { label, color } = getOptionalData(value ?? "");
        return (
          <DataTableColumnSelectCode
            value={value}
            label={label}
            color={color}
            reverse
          />
        );
      }
    },
    skeletonClassName: "w-10",
  },
  date: {
    id: "date",
    label: "Date",
    type: "timerange",
    component: (props: Record<string, unknown> & { id?: string }) =>
      format(new Date(String(props[props.id ?? "date"])), "LLL dd, y HH:mm:ss"),
    skeletonClassName: "w-36",
  },
  number: {
    id: "number",
    label: "Number",
    type: "slider",
    component: (props: Record<string, unknown> & { id?: string }) => (
      <>
        {"left" in props && typeof props.left === "string" && (
          <span className="text-muted-foreground">{props.left}</span>
        )}
        {formatMilliseconds(Number(props[props.id ?? "number"]))}
        {"right" in props && typeof props.right === "string" && (
          <span className="text-muted-foreground">{props.right}</span>
        )}
      </>
    ),
    skeletonClassName: "w-16",
  },
  uuid: {
    id: "uuid",
    label: "Request ID",
    type: "readonly",
    skeletonClassName: "w-64",
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
  timeline: {
    id: "timeline",
    label: "Timeline",
    type: "readonly",
    component: (
      props: Record<string, unknown> & {
        id?: string;
        options: ColumnOption[];
        left?: string;
        right?: string;
      }
    ) => {
      const options = props.options.map((option) => option.value);
      const values =
        options.length > 0
          ? options.map((option) => props[option] as number)
          : [];
      const labels = props.options.map((option) => option.label ?? null);
      const colors = props.options.map((option) => option.color ?? "default");

      const total = values.reduce((acc, curr) => acc + curr, 0);
      return (
        <SheetTimelinePhases
          options={options}
          values={values}
          labels={labels}
          colors={colors}
          total={total}
          left={props.left}
          right={props.right}
        />
      );
    },
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
    component: (props: { message?: string; color?: string }) => (
      <CopyToClipboardContainer color={props.color ?? "default"}>
        {JSON.stringify(props.message, null, 2)}
      </CopyToClipboardContainer>
    ),
    className: "flex-col items-start w-full gap-1",
  },
};
