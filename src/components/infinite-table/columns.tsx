/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnSchema } from "./schema";
import { columnTypes } from "./column-types";

export interface ColumnConfig {
  id: string;
  type: string;
  label?: string;
}

export function getColumns(config: ColumnConfig[]): ColumnDef<ColumnSchema>[] {
  return config
    .map((col) => {
      const base = columnTypes[col.type];
      return {
        ...base,
        id: col.id,
        accessorKey: "accessorKey" in base && col.id,
        label: col.label ?? base.label,
        header:
          base.header &&
          base.header !== "" &&
          (typeof base.header === "function"
            ? (props: any) =>
                (base.header as Function)({
                  ...props,
                  column: { ...props.column, label: col.label ?? col.id },
                })
            : col.label ?? base.label),
      };
    })
    .filter(Boolean) as ColumnDef<ColumnSchema>[];
}
