import InfiniteTable from "@/components/infinite-table/infinite-table";
import { useLocation } from "react-router";

function useSearchParamsObject() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const obj: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key])
        ? [...obj[key], value]
        : [obj[key], value];
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

function Home() {
  const searchParams = useSearchParamsObject();
  return (
    <>
      <InfiniteTable
        url={"https://api.tu-backend.com/api"}
        searchParams={searchParams}
        columnConfig={[
          { id: "level", type: "level", label: "Nivel", noSheet: true },
          { id: "date", type: "date", label: "Fecha" },
          {
            id: "uuid",
            type: "uuid",
            label: "ID",
            noFilter: true,
          },
          {
            id: "status",
            type: "select",
            label: "Estado",
            options: ["200", "400", "404", "500"],
            colors: ["green", "yellow", "yellow", "red"],
            columnSize: 60,
            sheetClassName: "w-12",
          },
          {
            id: "method",
            type: "select",
            label: "Method",
            options: ["GET", "POST", "PUT", "DELETE"],
          },
          {
            id: "host",
            type: "string",
            label: "Host",
            columnSize: 125,
            sheetClassName: "w-24",
          },
          {
            id: "pathname",
            type: "string",
            label: "Ruta",
            columnSize: 130,
            sheetClassName: "w-56",
          },
          {
            id: "latency",
            type: "number",
            label: "Latencia",
            min: 0,
            max: 5000,
            right: "ms",
          },
          {
            id: "regions",
            type: "select",
            label: "Regiones",
            options: ["ams", "fra", "gru", "hkg", "iad", "syd"],
            labels: [
              "Amsterdam",
              "Frankfurt",
              "Sao Paulo",
              "Hong Kong",
              "Washington D.C.",
              "Sydney",
            ],
            columnSize: 163,
            sheetClassName: "w-12",
          },
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
      ></InfiniteTable>
    </>
  );
}

export default Home;
