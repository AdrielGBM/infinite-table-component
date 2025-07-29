import { useQueryStates } from "nuqs";
import { useInfiniteQuery as useInfiniteTanstackQuery } from "@tanstack/react-query";
import { dataOptions } from "./query-options";
import { searchParamsParser } from "./search-params";
import type { ColumnConfig } from "./config-types";

export function useInfiniteQuery(url: string, columnConfig: ColumnConfig[]) {
  const [search] = useQueryStates(searchParamsParser(columnConfig));
  const query = useInfiniteTanstackQuery(
    dataOptions(url, search, columnConfig)
  );
  return query;
}
