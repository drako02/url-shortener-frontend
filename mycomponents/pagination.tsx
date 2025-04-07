"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  // limit: number;
  onPageChangeAction: (page: number) => void; // Renamed from onPageChange
  className?: string;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  // limit,
  onPageChangeAction, // Renamed from onPageChange
  className,
}: CustomPaginationProps) => {
  const handleOffset = (dir: "next" | "previous") => {
    if (dir === "next" && currentPage < totalPages) {
      onPageChangeAction(currentPage + 1);
    } else if (dir === "previous" && currentPage > 1) {
      onPageChangeAction(currentPage - 1);
    }
  };

  const setPage = (page: number) => {
    onPageChangeAction(page);
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <Pagination className={cn("w-full", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage === 1 ? "pointer-events-none opacity-50" : "",
              "transition-opacity"
            )}
            onClick={
              currentPage === 1 ? undefined : () => handleOffset("previous")
            }
            href="#"
          />
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(1);
                }}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
          (page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(totalPages);
                }}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages ? "pointer-events-none opacity-50" : "",
              "transition-opacity"
            )}
            onClick={
              currentPage >= totalPages ? undefined : () => handleOffset("next")
            }
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};