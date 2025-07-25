import { useDataTable } from "@/components/data-table/useDataTable";
import { Button } from "@/components/ui/button";
import { useHotKey } from "@/hooks/use-hot-key";
import { cn } from "@/lib/utils";
import type { FetchPreviousPageOptions } from "@tanstack/react-query";
import { CirclePause, CirclePlay } from "lucide-react";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { searchParamsParser } from "../search-params";
import type { ColumnConfig } from "../infinite-table";

const REFRESH_INTERVAL = 4_000;

interface LiveButtonProps {
  fetchPreviousPage?: (options?: FetchPreviousPageOptions) => Promise<unknown>;
  columnConfig: ColumnConfig[];
}

export function LiveButton({
  fetchPreviousPage,
  columnConfig,
}: LiveButtonProps) {
  const [{ live, date, sort }, setSearch] = useQueryStates(
    searchParamsParser(columnConfig)
  );
  const { table } = useDataTable();
  useHotKey(handleClick, "j");

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      if (live) {
        await fetchPreviousPage?.();
        timeoutId = setTimeout(() => {
          void fetchData();
        }, REFRESH_INTERVAL);
      } else {
        clearTimeout(timeoutId);
      }
    }

    void fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [live, fetchPreviousPage]);

  // REMINDER: make sure to reset live when date is set
  // TODO: test properly
  React.useEffect(() => {
    if ((date || sort) && live) {
      void setSearch((prev) => ({ ...prev, live: null }));
    }
  }, [date, sort]);

  function handleClick() {
    void setSearch((prev) => ({
      ...prev,
      live: !prev.live,
      date: null,
      sort: null,
    }));
    table.getColumn("date")?.setFilterValue(undefined);
    table.resetSorting();
  }

  return (
    <Button
      className={cn(live && "border-info text-info hover:text-info")}
      onClick={handleClick}
      variant="outline"
      size="sm"
    >
      {live ? (
        <CirclePause className="mr-2 h-4 w-4" />
      ) : (
        <CirclePlay className="mr-2 h-4 w-4" />
      )}
      Live
    </Button>
  );
}
