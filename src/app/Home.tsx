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
      {/* TODO: Se deben corregir errores de compilación. */}
      <InfiniteTable
        url={"https://api.tu-backend.com/api"}
        searchParams={searchParams}
        columnConfig={[
          {
            id: "level",
            type: "select",
            label: "Nivel",
            options: [
              { value: "success", label: "Success", color: "green" },
              { value: "warning", label: "Warning", color: "orange" },
              { value: "error", label: "Error", color: "red" },
              { value: "info", label: "Info", color: "blue" },
            ],
            showColor: true,
            noSheet: true,
            chartMain: true,
          },
          {
            id: "uuid",
            type: "uuid",
            label: "ID",
            default: false,
            noFilter: true,
          },
          { id: "date", type: "date", label: "Fecha" },
          {
            id: "status",
            type: "select",
            label: "Estado",
            options: [
              { value: "200", color: "green" },
              { value: "400", color: "orange" },
              { value: "404", color: "orange" },
              { value: "500", color: "red" },
            ],
            columnSize: 60,
            sheetClassName: "w-12",
          },
          {
            id: "method",
            type: "select",
            label: "Method",
            options: [
              { value: "GET" },
              { value: "POST" },
              { value: "PUT" },
              { value: "DELETE" },
            ],
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
            options: [
              { value: "ams", label: "Amsterdam" },
              { value: "fra", label: "Frankfurt" },
              { value: "gru", label: "Sao Paulo" },
              { value: "hkg", label: "Hong Kong" },
              { value: "iad", label: "Washington D.C." },
              { value: "syd", label: "Sydney" },
            ],
            columnSize: 163,
            sheetClassName: "w-12",
          },
          {
            id: "timeline",
            type: "timeline",
            label: "Línea de tiempo",
            options: [
              { value: "dns", label: "DNS", color: "emerald" },
              { value: "connection", label: "Conexión", color: "cyan" },
              { value: "tls", label: "TLS", color: "blue" },
              { value: "ttfb", label: "TTFB", color: "violet" },
              { value: "transfer", label: "Transferencia", color: "purple" },
            ],
            right: "ms",
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
            type: "table",
            label: "Encabezados",
            noColumn: true,
            noFilter: true,
          },
          {
            id: "message",
            type: "message",
            label: "Mensaje",
            color: "red",
            noColumn: true,
            noFilter: true,
          },
        ]}
        rowConfig={{ label: "pathname" }} // It can be the value of a column or a fixed string
      ></InfiniteTable>
    </>
  );
}

export default Home;
