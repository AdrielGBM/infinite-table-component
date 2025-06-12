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
      ></InfiniteTable>
    </>
  );
}

export default Home;
