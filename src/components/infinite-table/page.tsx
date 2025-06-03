import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "./query-options";
import { Client } from "./client";
import { useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  useEffect(() => {
    async function search() {
      const search = searchParamsCache.parse(searchParams);
      const queryClient = getQueryClient();
      await queryClient.prefetchInfiniteQuery(dataOptions(search));
    }
    void search();
  }, [searchParams]);

  return <Client />;
}
