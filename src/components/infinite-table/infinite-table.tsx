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
  }, [url, searchParams]);

  return (
    <Client
      url={url}
      columnConfig={[
        { id: "level", type: "level", label: "Nivel", noSheet: true },
        { id: "date", type: "date", label: "Fecha" },
        {
          id: "uuid",
          type: "uuid",
          label: "ID",
          noFilter: true,
        },
        { id: "status", type: "status", label: "Estado" },
        { id: "method", type: "method", label: "Method" },
        { id: "host", type: "host", label: "Host" },
        { id: "pathname", type: "pathname", label: "Ruta" },
        { id: "latency", type: "latency", label: "Latencia" },
        { id: "regions", type: "regions", label: "Regiones" },
        {
          id: "timing",
          type: "timing",
          label: "Línea de tiempo",
          noFilter: true,
          noSheet: true,
        },
        { id: "timing.dns", type: "timing_dns", label: "DNS" },
        {
          id: "timing.connection",
          type: "timing_connection",
          label: "Conexión",
          noSheet: true,
        },
        { id: "timing.tls", type: "timing_tls", label: "TLS", noSheet: true },
        {
          id: "timing.ttfb",
          type: "timing_ttfb",
          label: "TTFB",
          noSheet: true,
        },
        {
          id: "timing.transfer",
          type: "timing_transfer",
          label: "Transferencia",
          noSheet: true,
        },
        {
          id: "percentile",
          type: "percentile",
          label: "Percentil",
          noColumn: true,
          noFilter: true,
        },
        {
          id: "headers",
          type: "headers",
          label: "Encabezados",
          noColumn: true,
          noFilter: true,
        },
        {
          id: "message",
          type: "message",
          label: "Mensaje",
          noColumn: true,
          noFilter: true,
        },
      ]}
    />
  );
}
