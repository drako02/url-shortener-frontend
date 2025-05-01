"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const TableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        {["ID", "Short URL", "Long URL", "Created At", ""].map((_, i) => (
          <TableHead key={i}>
            <Skeleton className="h-6 w-full" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <TableRow key={i} className="animate-pulse">
            {Array(5)
              .fill(0)
              .map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
          </TableRow>
        ))}
    </TableBody>
  </Table>
);


interface TableLoaderProps {
  /** Number of rows to display in skeleton state */
  rowCount?: number;
  /** Number of columns to display in skeleton state */
  columnCount?: number;
  /** Custom height for the loader (default: "auto") */
  height?: string | number;
  /** Custom classNames to apply to the container */
  className?: string;
  /** Whether to show header skeletons */
  showHeader?: boolean;
}

/**
 * TableLoader component displays a placeholder loading state for tables
 * with customizable number of rows, columns and custom styling
 */
export function TableLoader({
  rowCount = 5,
  columnCount = 4,
  height = "auto",
  className,
  showHeader = true,
}: TableLoaderProps) {
  return (
    <div 
      className={cn("w-full m-[2%] border-[1px] rounded-lg", className || "")}
      style={{ height }}
    >
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={`header-${index}`}>
                  <Skeleton className="h-6 w-24" /> {/* Fixed width of 6rem */}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} className="h-[52px]">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" /> {/* Fixed width of 6rem */}
                    {/* Use consistent pattern for sublabels based on column type */}
                    {/* {[2, 3].includes(colIndex) && (
                      <Skeleton className="h-3 w-16 mt-1" />
                    )} */}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}