import { useHotKey } from "@/hooks/use-hot-key";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { LiveRow } from "./_components/live-row";
import { getColumns } from "./columns";
import { getFilterFields, getSheetFields } from "./constants";
import { DataTableInfinite } from "./data-table-infinite";
import { dataOptions, type LogsMeta } from "./query-options";
import { searchParamsParser } from "./search-params";
import { mock } from "./mock";
import {
  useLiveMode,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "./useLiveMode";
import type { ColumnConfig, RowConfig } from "./config-types";

export function Client({
  url,
  columnConfig,
  rowConfig,
}: {
  columnConfig: ColumnConfig[];
  rowConfig: RowConfig;
  url: string;
}) {
  const [search] = useQueryStates(searchParamsParser(columnConfig));
  const {
    data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery(dataOptions(url, search, columnConfig));
  useResetFocus();

  const flatData = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? mock, // ?? []
    [data?.pages]
  );

  const liveMode = useLiveMode(flatData, columnConfig);

  // REMINDER: meta data is always the same for all pages as filters do not change(!)
  const lastPage = data?.pages[data.pages.length - 1];
  const totalDBRowCount = lastPage?.meta.totalRowCount;
  const filterDBRowCount = lastPage?.meta.filterRowCount;
  const metadata = lastPage?.meta.metadata;
  const chartData = lastPage?.meta.chartData;
  const facets = lastPage?.meta.facets;
  const totalFetched = flatData.length;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sort, start, size, uuid, cursor, direction, live, ...filter } =
    search;

  // REMINDER: this is currently needed for the cmdk search
  // TODO: auto search via API when the user changes the filter instead of hardcoded
  const filterFields = React.useMemo(() => {
    return getFilterFields(columnConfig).map((field) => {
      const facetsField = facets?.[field.value];
      if (!facetsField) return field;
      if (field.options && field.options.length > 0) return field;

      // REMINDER: if no options are set, we need to set them via the API
      const options = facetsField.rows.map(({ value }) => {
        return {
          label: String(value),
          value: String(value),
        };
      });

      if (field.type === "slider") {
        return {
          ...field,
          min: facetsField.min ?? field.min,
          max: facetsField.max ?? field.max,
          options,
        };
      }

      return { ...field, options };
    });
  }, [facets, columnConfig]);

  return (
    <DataTableInfinite
      columns={getColumns(columnConfig)}
      data={flatData}
      totalRows={totalDBRowCount}
      filterRows={filterDBRowCount}
      totalRowsFetched={totalFetched}
      defaultColumnFilters={Object.entries(filter)
        .map(([key, value]) => ({
          id: key,
          value,
        }))
        .filter(({ value }) => value ?? undefined)}
      defaultColumnSorting={sort ? [sort] : undefined}
      defaultRowSelection={search.uuid ? { [search.uuid]: true } : undefined}
      // FIXME: make it configurable - TODO: use `columnHidden: boolean` in `filterFields`
      defaultColumnVisibility={Object.fromEntries(
        columnConfig
          .filter((col) => Object.prototype.hasOwnProperty.call(col, "default"))
          .map((col) => [col.id, Boolean(col.default)])
      )}
      meta={metadata ?? ({} as LogsMeta)}
      filterFields={filterFields}
      sheetFields={getSheetFields(columnConfig)}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      fetchPreviousPage={fetchPreviousPage}
      refetch={() => {
        void refetch();
      }}
      chartData={chartData}
      chartDataColumnId="date"
      columnConfig={columnConfig}
      getRowClassName={(row) => {
        const dateValue = row.original.date;
        const rowTimestamp =
          dateValue instanceof Date
            ? dateValue.getTime()
            : new Date(dateValue).getTime();
        const isPast = rowTimestamp <= (liveMode.timestamp ?? -1);
        return cn(isPast ? "opacity-50" : "opacity-100");
      }}
      getRowId={(row) => String(row.uuid)}
      getFacetedUniqueValues={getFacetedUniqueValues(facets)}
      getFacetedMinMaxValues={getFacetedMinMaxValues(facets)}
      renderLiveRow={(props) => {
        if (!liveMode.timestamp) return null;
        if (props?.row.original.uuid !== liveMode.row?.uuid) return null;
        return <LiveRow length={columnConfig.length} />;
      }}
      renderSheetTitle={(props) =>
        (() => {
          if (props.row?.original && rowConfig.label in props.row.original) {
            const value = (props.row.original as Record<string, unknown>)[
              rowConfig.label
            ];
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              return String(value);
            }
          }
          return rowConfig.label;
        })()
      }
      searchParamsParser={searchParamsParser(columnConfig)}
    />
  );
}

function useResetFocus() {
  useHotKey(() => {
    // FIXME: some dedicated div[tabindex="0"] do not auto-unblur (e.g. the DataTableFilterResetButton)
    // REMINDER: we cannot just document.activeElement?.blur(); as the next tab will focus the next element in line,
    // which is not what we want. We want to reset entirely.
    document.body.setAttribute("tabindex", "0");
    document.body.focus();
    document.body.removeAttribute("tabindex");
  }, ".");
}
