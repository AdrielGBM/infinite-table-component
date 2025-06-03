import React from "react";
import type { Table as TTable } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import type { FacetMetadataSchema } from "./schema";
import { searchParamsParser } from "./search-params";

// TODO: make a BaseObject (incl. date and uuid e.g. for every upcoming branch of infinite table)
export function useLiveMode<TData extends { date: Date }>(data: TData[]) {
  const [live] = useQueryState("live", searchParamsParser.live);
  // REMINDER: used to capture the live mode on timestamp
  const liveTimestamp = React.useRef<number | undefined>(
    live ? new Date().getTime() : undefined
  );

  React.useEffect(() => {
    if (live) liveTimestamp.current = new Date().getTime();
    else liveTimestamp.current = undefined;
  }, [live]);

  const anchorRow = React.useMemo(() => {
    if (!live) return undefined;

    const item = data.find((item) => {
      // return first item that is there if not liveTimestamp
      if (!liveTimestamp.current) return true;
      // return first item that is after the liveTimestamp
      if (item.date.getTime() > liveTimestamp.current) return false;
      return true;
      // return first item if no liveTimestamp
    });

    return item;
  }, [live, data]);

  return { row: anchorRow, timestamp: liveTimestamp.current };
}

export function getFacetedUniqueValues<TData>(
  facets?: Record<string, FacetMetadataSchema>
) {
  return (_: TTable<TData>, columnId: string): Map<string, number> => {
    return new Map(
      facets?.[columnId]?.rows.map(
        ({ value, total }) => [value, total] as [string, number]
      ) ?? []
    );
  };
}

export function getFacetedMinMaxValues<TData>(
  facets?: Record<string, FacetMetadataSchema>
) {
  return (_: TTable<TData>, columnId: string): [number, number] | undefined => {
    const min = facets?.[columnId]?.min;
    const max = facets?.[columnId]?.max;
    if (typeof min === "number" && typeof max === "number") return [min, max];
    if (typeof min === "number") return [min, min];
    if (typeof max === "number") return [max, max];
    return undefined;
  };
}
