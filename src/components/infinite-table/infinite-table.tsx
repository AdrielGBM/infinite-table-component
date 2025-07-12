import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "./query-options";
import { Client } from "./client";
import { useEffect } from "react";
export interface ColumnConfig {
  id: string;
  type: string;
  label?: string;
  options?: string[];
  labels?: (string | null)[];
  colors?: (string | null)[];
  min?: number;
  max?: number;
  left?: string;
  right?: string;
  columnSize?: number;
  noColumn?: boolean;
  noFilter?: boolean;
  sheetClassName?: string;
  noSheet?: boolean;
}

export default function InfiniteTable({
  url,
  searchParams,
  columnConfig,
}: {
  url: string;
  searchParams: Record<string, string | string[] | undefined>;
  columnConfig: ColumnConfig[];
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

  return <Client url={url} columnConfig={columnConfig} />;
}
