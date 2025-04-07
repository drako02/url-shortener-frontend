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

export const TableComponent = (props: TableProps) => {
  const { headers, rows, pagination, isLoading } = props;

  if (isLoading) {
    return (
      <TableLoader 
        rowCount={10}
        columnCount={headers.length} 
        showHeader={true}
        className="w-full m-[2%]"
      />
    );
  }
  
  return (
    <div className="w-full m-[2%] border-[1px] rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} onClick={header.onClick}>
                <div>{header.element && header.element}</div>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, index) => {
                const { element, label, subLabel, tooltipContent, onClick } =
                  cell;
                return (
                  <TableCell key={index} onClick={onClick} className="">
                    <div className="text-[13px] font-medium">
                      {element && element}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="truncate max-w-[200px] ">{label}</p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {tooltipContent || label}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {subLabel && (
                        <p className="text-[0.9em] text-gray-600 ">
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
      {
        pagination &&
      
      <div className="h-[48px] w-full flex justify-center border-t-[1px]">
        <CustomPagination {...pagination}/>
      </div>
}
    </div>
  );
};
