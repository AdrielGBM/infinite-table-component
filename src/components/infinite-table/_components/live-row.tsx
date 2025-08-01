import { TableCell, TableRow } from "@/components/custom/table";
import { DataTableColumnShape } from "@/components/data-table/data-table-column/data-table-column-shape";

export function LiveRow({ length }: { length?: number }) {
  return (
    <TableRow>
      <TableCell className="w-(--header-level-size) min-w-(--header-level-size) max-w-(--header-level-size) border-b border-l border-r border-t border-info border-r-info/50">
        <DataTableColumnShape color="info" />
      </TableCell>
      <TableCell
        colSpan={length ? length - 1 : 0}
        className="border-b border-r border-t border-info font-medium text-info"
      >
        Live Mode
      </TableCell>
    </TableRow>
  );
}
