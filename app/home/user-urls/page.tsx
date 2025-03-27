"use client";

import { GO_SERVICE_BASE_URL } from "@/app/api/helpers";
import { getShortUrls } from "@/app/api/urls/urls";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/Auth";
// import { TableLoader } from "@/mycomponents/loaders/table";
import React, { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Search,
  Share2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Extend URL type with potential analytics data
type UrlData = {
  id: number;
  short_code: string;
  long_url: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
  visits?: number;
};

// Loading skeleton for the table
const TableSkeleton = () => (
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

// Empty state component
const EmptyState = () => (
  <Card className="w-full max-w-3xl mx-auto mt-8 border-dashed">
    <CardHeader className="text-center">
      <CardTitle>No URLs Yet</CardTitle>
      <CardDescription>
        You haven&apos;t created any shortened URLs yet.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center pb-6">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      <Button asChild variant="default" className="mt-4">
        <a href="/home">Create Your First Shortened URL</a>
      </Button>
    </CardContent>
  </Card>
);

const UserUrlsPage = () => {
  const [urlCount, setUrlCount] = useState<number>(0);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<UrlData[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UrlData | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const limit = 10;

  const { user } = useAuth();

  // Fetch URLs from API
  const fetchUrls = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const res = await getShortUrls(user.uid as string, limit, offset);

      // Convert date strings to Date objects
      const formattedUrls = res.urls.map((url) => ({
        ...url,
        created_at: new Date(url.created_at),
        updated_at: new Date(url.updated_at),
        // Add dummy analytics data - replace with real data when available
        visits: Math.floor(Math.random() * 100),
      }));

      setUrls(formattedUrls);
      setFilteredUrls(formattedUrls);
      setUrlCount(res.recordCount);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, offset]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Handle pagination
  const handleOffset = (dir: "next" | "previous") => {
    if (dir === "next") {
      setOffset(offset + limit);
    } else {
      setOffset(Math.max(0, offset - limit));
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("URL copied to clipboard"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  // Share URL
  const shareUrl = (url: string, title: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this link",
          text: title,
          url: url,
        })
        .catch(() => {
          // Fallback if share fails
          copyToClipboard(url);
        });
    } else {
      // Fallback for browsers that don't support sharing
      copyToClipboard(url);
    }
  };

  // Handle search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUrls(urls);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = urls.filter(
      (url) =>
        url.long_url.toLowerCase().includes(lowercasedTerm) ||
        url.short_code.toLowerCase().includes(lowercasedTerm)
    );

    setFilteredUrls(filtered);
  }, [searchTerm, urls]);

  // Handle sorting
  const handleSort = (key: keyof UrlData) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      // Reset to original order
      setFilteredUrls([...urls]);
      return;
    }

    const sortedUrls = [...filteredUrls].sort((a, b) => {
      if (key === "created_at" || key === "updated_at") {
        // Add null checks or provide fallback values
        const aTime = a[key] instanceof Date ? a[key].getTime() : 0;
        const bTime = b[key] instanceof Date ? b[key].getTime() : 0;

        if (direction === "asc") {
          return aTime - bTime;
        }
        return bTime - aTime;
      }

      // Handle potentially undefined values for other properties
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUrls(sortedUrls);
  };

  const getSortIcon = (key: keyof UrlData) => {
    if (sortConfig.key !== key) {
      return <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-30" />;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }

    return <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-30" />;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>
        <div className="h-10 w-full max-w-md opacity-50">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  // Render empty state
  if (!urls.length) {
    return <EmptyState />;
  }

  // Table header columns
  const tableHeaderList = [
    { key: "id" as keyof UrlData, label: "ID" },
    { key: "short_code" as keyof UrlData, label: "Short URL" },
    { key: "long_url" as keyof UrlData, label: "Long URL" },
    { key: "created_at" as keyof UrlData, label: "Created At" },
    { key: "visits" as keyof UrlData, label: "Visits" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-300 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>

        <div className="relative w-full md:w-auto max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search URLs..."
            className="pl-9 pr-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="pb-2">
              {filteredUrls.length === urls.length
                ? `Showing ${Math.min(offset + 1, urlCount)} to ${Math.min(
                    offset + filteredUrls.length,
                    urlCount
                  )} of ${urlCount} URLs`
                : `Filtered: ${filteredUrls.length} results`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                {tableHeaderList.map((header) => (
                  <TableHead
                    key={String(header.key)}
                    className="group cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort(header.key)}
                  >
                    <div className="flex items-center">
                      {header.label}
                      {getSortIcon(header.key)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUrls.map((url, index) => (
                <motion.tr
                  key={url.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="font-medium">#{url.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[250px]">
                      <span className="truncate font-mono text-sm text-primary">
                        {`${GO_SERVICE_BASE_URL}/${url.short_code}`}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                copyToClipboard(
                                  `${GO_SERVICE_BASE_URL}/${url.short_code}`
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy URL</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy to clipboard</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              asChild
                            >
                              <a
                                href={`${GO_SERVICE_BASE_URL}/${url.short_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open URL</span>
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Visit link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate hover:overflow-visible hover:whitespace-normal hover:z-10">
                      <a
                        href={url.long_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                      >
                        {url.long_url}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {new Date(url.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(url.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={(url.visits ?? 0) > 50 ? "default" : "outline"}
                      className={cn(
                        "whitespace-nowrap",
                        (url.visits ?? 0) > 50
                          ? "bg-primary"
                          : "border-primary/20"
                      )}
                    >
                      {url.visits} views
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                shareUrl(
                                  `${GO_SERVICE_BASE_URL}/${url.short_code}`,
                                  "Shortened URL"
                                )
                              }
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share URL</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share URL</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
              {filteredUrls.length > 0 &&
                filteredUrls.length < limit &&
                Array(limit - filteredUrls.length)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-[52px]">
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground/50"
                      >
                        {index === 0 && filteredUrls.length === 0
                          ? "No matching URLs found"
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
            <TableFooter className="border-t">
              <TableRow>
                <TableCell colSpan={6} className="p-2">
                  <Pagination className="flex w-full justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={cn(
                            offset === 0
                              ? "pointer-events-none opacity-50"
                              : "",
                            "transition-opacity"
                          )}
                          onClick={
                            offset === 0
                              ? undefined
                              : () => handleOffset("previous")
                          }
                          href="#"
                        />
                      </PaginationItem>

                      {(() => {
                        const totalPages = Math.ceil(urlCount / limit);
                        const currentPage = Math.floor(offset / limit) + 1;
                        const maxVisiblePages = 5;

                        let startPage = Math.max(
                          1,
                          currentPage - Math.floor(maxVisiblePages / 2)
                        );
                        const endPage = Math.min(
                          totalPages,
                          startPage + maxVisiblePages - 1
                        );

                        if (endPage === totalPages) {
                          startPage = Math.max(
                            1,
                            endPage - maxVisiblePages + 1
                          );
                        }

                        const pages = [];

                        if (startPage > 1) {
                          pages.push(
                            <PaginationItem key="first">
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOffset(0);
                                }}
                                isActive={currentPage === 1}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          );

                          if (startPage > 2) {
                            pages.push(
                              <PaginationItem key="start-ellipsis">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOffset((i - 1) * limit);
                                }}
                                isActive={currentPage === i}
                              >
                                {i}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <PaginationItem key="end-ellipsis">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          pages.push(
                            <PaginationItem key="last">
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOffset((totalPages - 1) * limit);
                                }}
                                isActive={currentPage === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        return pages;
                      })()}

                      <PaginationItem>
                        <PaginationNext
                          className={cn(
                            offset + limit >= urlCount
                              ? "pointer-events-none opacity-50"
                              : "",
                            "transition-opacity"
                          )}
                          onClick={
                            offset + limit >= urlCount
                              ? undefined
                              : () => handleOffset("next")
                          }
                          href="#"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default UserUrlsPage;
