import { useQueryStates } from "nuqs";
import { useInfiniteQuery as useInfiniteTanstackQuery } from "@tanstack/react-query";
import { dataOptions } from "./query-options";
import { searchParamsParser } from "./search-params";

export function useInfiniteQuery(url: string) {
  const [search] = useQueryStates(searchParamsParser);
  const query = useInfiniteTanstackQuery(dataOptions(url, search));
  return query;
}
