import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "./query-options";
import { Client } from "./client";
import { useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  useEffect(() => {
    async function search() {
      const search = searchParamsCache.parse(await searchParams);
      const queryClient = getQueryClient();
      await queryClient.prefetchInfiniteQuery(dataOptions(search));
    }
    search();
  }, [searchParams]);

  return <Client />;
}
