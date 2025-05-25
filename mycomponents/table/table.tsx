"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableProps } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomPagination } from "../pagination";
import { TableLoader } from "../loaders/table";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

export const TableComponent = (props: TableProps) => {
  const { headers, rows, pagination, isLoading, className } = props;

  if (isLoading) {
    return (
      <TableLoader
        rowCount={8}
        columnCount={headers.length}
        showHeader={false}
        className={cn("w-full m-1", className)}
        height={"80%"}
      />
    );
  }

  if (rows.length === 0 && !isLoading) {
    return (
      <div className={cn("w-full py-16 flex flex-col items-center justify-center border-[1px] rounded-lg bg-slate-50/50", className)}>
        <div className="bg-slate-100 p-4 rounded-full mb-3">
          <FileIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-lg font-medium text-slate-700">No data available</p>
        <p className="text-sm text-slate-500 mt-1">There are no entries to display</p>
      </div>
    );
  }

  return (
    <div
      className={cn("border-[1px] rounded-lg overflow-hidden shadow-sm bg-white", className || "")}
    >
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50/80 border-b-2">
            {headers.map((header, index) => (
              <TableHead 
                key={index} 
                onClick={header.onClick}
                className={cn(
                  "py-4 font-semibold text-sm text-slate-700 uppercase tracking-wider",
                  header.onClick && "cursor-pointer hover:text-primary transition-colors"
                )}
              >
                <div className="flex items-center gap-2">
                  {header.element && header.element}
                  {header.label}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow 
              key={index}
              className={cn(
                "transition-colors",
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                "hover:bg-blue-50/50"
              )}
            >
              {row.map((cell, cellIndex) => {
                const { element, label, subLabel, tooltipContent, onClick } = cell;
                return (
                  <TableCell 
                    key={cellIndex} 
                    onClick={onClick} 
                    className={cn(
                      "py-3 border-t border-slate-100",
                      onClick && "cursor-pointer hover:text-primary transition-colors"
                    )}
                  >
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center gap-2">
                        {element && <div className="flex-shrink-0">{element}</div>}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate max-w-[200px] text-[14px] font-medium text-slate-800">{label}</p>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-sm">
                              {tooltipContent || label}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {subLabel && (
                        <p className="text-xs text-slate-500">
                          {subLabel}
                        </p>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="h-[56px] w-full flex justify-center items-center border-t bg-slate-50/50">
          <CustomPagination {...pagination} />
        </div>
      )}
    </div>
  );
};
