import type { Percentile } from "@/lib/request/percentile";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import SuperJSON from "superjson";
import type {
  BaseChartSchema,
  ColumnSchema,
  FacetMetadataSchema,
} from "./schema";
import { searchParamsSerializer, type SearchParamsType } from "./search-params";

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

export const dataOptions = (url: string, search: SearchParamsType) => {
  return infiniteQueryOptions({
    queryKey: [
      "data-table",
      searchParamsSerializer({ ...search, uuid: null, live: null }),
    ], // remove uuid/live as it would otherwise retrigger a fetch
    queryFn: async ({ pageParam }) => {
      const cursor = new Date(pageParam.cursor);
      const direction = pageParam.direction as "next" | "prev" | undefined;
      const serialize = searchParamsSerializer({
        ...search,
        cursor,
        direction,
        uuid: null,
        live: null,
      });
      const response = await fetch(`${url}${serialize}`);
      const json = await response.text();
      return SuperJSON.parse<InfiniteQueryResponse<ColumnSchema[], LogsMeta>>(
        json
      );
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
