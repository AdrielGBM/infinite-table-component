import type { Percentile } from "@/lib/request/percentile";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import SuperJSON from "superjson";
import type {
  BaseChartSchema,
  ColumnSchema,
  FacetMetadataSchema,
} from "./schema";
import { searchParamsSerializer, type SearchParamsType } from "./search-params";
import type { ColumnConfig, SelectColumnConfig } from "./config-types";
import { mock } from "./mock";

export interface LogsMeta {
  currentPercentiles: Record<Percentile, number>;
}

export interface InfiniteQueryMeta<TMeta = Record<string, unknown>> {
  totalRowCount: number;
  filterRowCount: number;
  chartData: BaseChartSchema[];
  facets: Record<string, FacetMetadataSchema>;
  metadata?: TMeta;
}

export interface InfiniteQueryResponse<TData, TMeta = unknown> {
  data: TData;
  meta: InfiniteQueryMeta<TMeta>;
  prevCursor: number | null;
  nextCursor: number | null;
}

function generateMockChartData(
  columnConfig: ColumnConfig[]
): BaseChartSchema[] {
  const mainChartColumn = columnConfig.find(
    (col): col is SelectColumnConfig =>
      col.type === "select" && "chartMain" in col && col.chartMain === true
  );

  if (!mainChartColumn) return [];

  const chartDataMap = new Map<number, Record<string, number>>();

  mock.forEach((item) => {
    const timestamp = new Date(item.date).getTime();
    const level = (item as Record<string, unknown>)[
      mainChartColumn.id
    ] as string;

    if (!chartDataMap.has(timestamp)) {
      const levelCounts: Record<string, number> = { timestamp };
      mainChartColumn.options.forEach((option) => {
        levelCounts[option.value] = 0;
      });
      chartDataMap.set(timestamp, levelCounts);
    }

    const currentData = chartDataMap.get(timestamp);
    if (currentData && level && typeof level === "string") {
      currentData[level] = (currentData[level] || 0) + 1;
    }
  });

  return Array.from(chartDataMap.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((item) => ({ ...item, timestamp: item.timestamp }));
}

function generateMockResponse(
  columnConfig: ColumnConfig[]
): InfiniteQueryResponse<ColumnSchema[], LogsMeta> {
  return {
    data: mock as ColumnSchema[],
    meta: {
      totalRowCount: mock.length,
      filterRowCount: mock.length,
      chartData: generateMockChartData(columnConfig),
      facets: {},
      metadata: {
        currentPercentiles: {
          50: 1000,
          75: 1200,
          90: 1400,
          95: 1500,
          99: 1600,
        },
      } as LogsMeta,
    },
    prevCursor: null,
    nextCursor: null,
  };
}

export const dataOptions = (
  url: string,
  search: SearchParamsType,
  columnConfig: ColumnConfig[]
) => {
  return infiniteQueryOptions({
    queryKey: [
      "data-table",
      searchParamsSerializer(columnConfig)({
        ...search,
        uuid: null,
        live: null,
      }),
    ], // remove uuid/live as it would otherwise retrigger a fetch
    queryFn: async ({ pageParam }) => {
      const cursor = new Date(pageParam.cursor);
      const direction = pageParam.direction as "next" | "prev" | undefined;
      const serialize = searchParamsSerializer(columnConfig)({
        ...search,
        cursor,
        direction,
        uuid: null,
        live: null,
      });

      try {
        const response = await fetch(`${url}${serialize}`);

        if (!response.ok) {
          console.warn("API request failed, using mock data");
          return generateMockResponse(columnConfig);
        }

        const json = await response.text();
        return SuperJSON.parse<InfiniteQueryResponse<ColumnSchema[], LogsMeta>>(
          json
        );
      } catch (error) {
        console.warn("API request failed, using mock data:", error);
        return generateMockResponse(columnConfig);
      }
    },
    initialPageParam: { cursor: new Date().getTime(), direction: "next" },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.prevCursor) return null;
      return { cursor: firstPage.prevCursor, direction: "prev" };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) return null;
      return { cursor: lastPage.nextCursor, direction: "next" };
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
