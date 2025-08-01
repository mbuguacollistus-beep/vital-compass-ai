import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { LoadingSpinner } from "./loading-spinner";
import { EmptyState } from "./empty-state";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  emptyDescription = "There are no records to display."
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                {column.render 
                  ? column.render(item)
                  : String(item[column.key] || '-')
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}