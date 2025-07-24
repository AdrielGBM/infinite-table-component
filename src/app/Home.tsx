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
      {/* TODO: Se debe agregar una configuración general de la tabla, debe incluir el título que aparece en la sidebar. */
      /* TODO: Falta trabajar los types de level, percentile, headers y message. */
      /* TODO: Se deben corregir errores de compilación que han aparecido con la modificación de los types. */}
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
            default: false,
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
            id: "timeline",
            type: "timeline",
            label: "Línea de tiempo",
            options: ["dns", "connection", "tls", "ttfb", "transfer"],
            labels: ["DNS", "Conexión", "TLS", "TTFB", "Transferencia"],
            right: "ms",
            colors: ["emerald", "cyan", "blue", "violet", "purple"],
            noFilter: true,
          },
          {
            id: "dns",
            type: "number",
            label: "DNS",
            right: "ms",
            default: false,
            noSheet: true,
          },
          {
            id: "connection",
            type: "number",
            label: "Conexión",
            right: "ms",
            default: false,
            noSheet: true,
          },
          {
            id: "tls",
            type: "number",
            label: "TLS",
            right: "ms",
            default: false,
            noSheet: true,
          },
          {
            id: "ttfb",
            type: "number",
            label: "TTFB",
            right: "ms",
            default: false,
            noSheet: true,
          },
          {
            id: "transfer",
            type: "number",
            label: "Transferencia",
            right: "ms",
            default: false,
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
