import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "./query-options";
import { Client } from "./client";
import { useEffect } from "react";
import type { ColumnConfig, RowConfig } from "./config-types";

export default function InfiniteTable({
  url,
  searchParams,
  columnConfig,
  rowConfig,
}: {
  url: string;
  searchParams: Record<string, string | string[] | undefined>;
  columnConfig: ColumnConfig[];
  rowConfig: RowConfig;
}) {
  useEffect(() => {
    async function search() {
      const search = searchParamsCache(columnConfig).parse(searchParams);
      const queryClient = getQueryClient();
      await queryClient.prefetchInfiniteQuery(
        dataOptions(url, search, columnConfig)
      );
    }
    void search();
  }, [url, searchParams]);

  return <Client url={url} columnConfig={columnConfig} rowConfig={rowConfig} />;
}
