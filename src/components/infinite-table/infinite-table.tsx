import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "./query-options";
import { Client } from "./client";
import { useEffect } from "react";

export default function InfiniteTable({
  url,
  searchParams,
}: {
  url: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  useEffect(() => {
    async function search() {
      const search = searchParamsCache.parse(searchParams);
      const queryClient = getQueryClient();
      await queryClient.prefetchInfiniteQuery(dataOptions(url, search));
    }
    void search();
  }, [searchParams]);

  return (
    <Client
      url={url}
      columnTypes={[
        { id: "level", type: "level", label: "Nivel" },
        { id: "date", type: "date", label: "Fecha" },
        { id: "uuid", type: "uuid", label: "ID" },
        { id: "status", type: "status", label: "Estado" },
        { id: "method", type: "method", label: "Method" },
        { id: "host", type: "host", label: "Host" },
        { id: "pathname", type: "pathname", label: "Ruta" },
        { id: "latency", type: "latency", label: "Latencia" },
        { id: "regions", type: "regions", label: "Regiones" },
        { id: "timing", type: "timing", label: "Línea de tiempo" },
        { id: "timing.dns", type: "timing_dns", label: "DNS" },
        {
          id: "timing.connection",
          type: "timing_connection",
          label: "Conexión",
        },
        { id: "timing.tls", type: "timing_tls", label: "TLS" },
        { id: "timing.ttfb", type: "timing_ttfb", label: "TTFB" },
        {
          id: "timing.transfer",
          type: "timing_transfer",
          label: "Transferencia",
        },
      ]}
    />
  );
}
