"use client";
import { fetchRequest, logError, mapToURL, URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { ShortUrl, URLResponse } from "@/app/api/types";
import { useUrls } from "@/context/_Urls";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/mycomponents/input/searchInput";
import { TableComponent } from "@/mycomponents/table/table";
import {
  BodyCellProps,
  HeaderContentProps,
  RowContentProps,
} from "@/mycomponents/table/types";
import { format, formatDistance } from "date-fns";
import { Link as LinkIcon, RefreshCw, Info, PointerIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Actions } from "../url/URLActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { URLCard } from "../card/card";
import { CustomPagination } from "../pagination";
import { motion, AnimatePresence } from "framer-motion";

export default function UserUrls() {
  const { urls, totalUrlCount, initializing, loadPage, applyFilter, refreshUrls } = useUrls();
  const [offset, setOffset] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  const limit = 10;
  const pathName = usePathname();
  const params = useSearchParams();
  const router = useRouter()
  const isSearchPage = pathName === "/search";

  const totalPages = useMemo(() => {
    return Math.ceil(totalUrlCount / limit);
  }, [totalUrlCount]);

  // Handle URL params for search state
  useEffect(() => {
    if (pathName !== "/user-urls") {
      const searchParam = params.get("filters[0][value]");
      const searchOffset = params.get("offset");

      if (searchParam) {
        setSearchValue(searchParam);
      }

      if (searchOffset) {
        setOffset(Number(searchOffset));
      }
    }
  }, [params, pathName]);

  // Load page data
  useEffect(() => {
    if (pathName === "/user-urls")   {
      loadPage(limit, offset);
    }
  }, [loadPage, offset, pathName]);

  // Table headers definition
  const tableHeaders: HeaderContentProps = useMemo(
    () => [
      { label: "ID" },
      { label: "Short Url" },
      { label: "Original" },
      { label: "Created" },
      { label: "Clicks" },
      { label: "Actions" },
    ],
    []
  );

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUrls();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const backToUrls = () => router.push("/user-urls")

  // Format and prepare data for display
  const currentPageUrls: RowContentProps[] | ShortUrl[] = useMemo(() => {
    const cardContent = Array.from({ length: limit })
      .map((_, i) => {
        return urls?.get(pathName === "/user-urls" ? offset + i : i);
      })
      .filter((url): url is URLResponse => url !== undefined)
      .map((url) => mapToURL(url));

    const tableContent = Array.from({ length: limit })
      .map((_, i) => {
        return urls?.get(pathName === "/user-urls" ? offset + i : i);
      })
      .filter((url): url is URLResponse => url !== undefined)
      .map((url) => mapToURL(url))
      .map((url): BodyCellProps[] => {
        const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
        const dateCreated = new Date(url.createdAt);
        const ageInMs = Date.now() - dateCreated.getTime();
        const isRecent = ageInMs < FOUR_DAYS_MS;

        const dateDisplay =
          ageInMs < FOUR_DAYS_MS
            ? formatDistance(dateCreated, new Date(), { addSuffix: true })
            : format(dateCreated, "PPp");

        const displayOriginalUrl = url.originalUrl.length > 45 
          ? url.originalUrl.substring(0, 45) + "..." 
          : url.originalUrl;
        
        const shortCodeDisplay = url.shortCode;
        
        return [
          { 
            element: (
              <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
                #{url.id.toString()}
              </span>
            ),
          },
          {
            element: (
              <Link
                href={`${URL_SERVICE_API_BASE_URL}/${url.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <div className="flex items-center justify-center p-1 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                  <LinkIcon size="12" className="text-blue-500 group-hover:text-blue-700" />
                </div>
                <span className="underline underline-offset-2 decoration-blue-200 group-hover:decoration-blue-400">
                  {shortCodeDisplay}
                </span>
              </Link>
            ),
            tooltipContent: `${URL_SERVICE_API_BASE_URL}/${url.shortCode}`,
            subLabel: "Click to open shortened URL"
          },
          { 
            tooltipContent: url.originalUrl,
            element: (
              <div className="flex flex-col">
                <span className="truncate max-w-[250px]">{displayOriginalUrl}</span>
                <span className="text-xs text-slate-400 truncate max-w-[250px]">
                  {new URL(url.originalUrl).hostname}
                </span>
              </div>
            )
          },
          { 
            element: (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                <span className={`${isRecent ? 'text-slate-800' : 'text-slate-600'}`}>
                  {dateDisplay}
                </span>
              </div>
            ),
            tooltipContent: format(dateCreated, "PPpp")
          },
          {element: <p className="flex flex-1">{url.clicks}</p>},
          { 
            element: (
              <div className="flex justify-end w-full">
                <Actions url={url} className="justify-end" />
              </div>
            ) 
          },
        ];
      });
    return isMobile ? cardContent : tableContent;
  }, [isMobile, offset, pathName, urls]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * limit;
    if (pathName === "/search") {
      const filterType = pathName.slice(1);

      if (filterType === "search" || filterType === "filter") {
        applyFilter(
          {
            filters: [
              {
                fields: ["short_code", "long_url"],
                value: searchValue,
                operator: "fulltext",
              },
            ],
            limit,
            offset: newOffset,
          },
          filterType
        );
      }
    }
    setOffset(newOffset);
  };

  // Handle search
  const handleSearch = async (value: string) => {
    setOffset(0);
    applyFilter(
      {
        filters: [
          {
            fields: ["short_code", "long_url"],
            value,
            operator: "fulltext",
          },
        ],
        limit,
        offset: 0,
      },
      "search"
    );
  };

  // Calculate display metrics
  const displayCount = (currentPageUrls).length;
  const startIndex = offset + 1;
  const endIndex = offset + displayCount;
  const searchQuery = params.get("filters[0][value]");

  return (
    <div className="p-6 md:max-w-7xl w-full mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isSearchPage ? "Search Results" : "Your Shortened URLs"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isSearchPage 
                ? `Found ${totalUrlCount} results for "${searchQuery}"`
                : `Manage and track all your shortened URLs in one place`
              }
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 self-start md:self-auto"
            onClick={handleRefresh}
            disabled={initializing || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="w-full">
            <SearchInput
              onSearch={handleSearch}
              onChange={setSearchValue}
              value={searchValue}
              placeholder="Search by URL or shortcode..."
              className="w-full max-w-none"
            />
          </div>
        </div>
        
        {displayCount > 0 && (
          <div className="bg-slate-50 px-3 py-2 rounded-md text-sm text-slate-600 mb-4 flex items-center gap-2">
            <Info size={14} className="text-slate-400" />
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalUrlCount}</span> URLs
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative min-h-[300px]">
        {/* Loading Overlay */}
        <AnimatePresence>
          {initializing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 rounded-lg flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-slate-700">Loading URLs...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <TableComponent
            headers={tableHeaders}
            rows={!isMobile ? (currentPageUrls as RowContentProps[]) : []}
            pagination={{
              totalPages,
              currentPage: Math.floor(offset / limit) + 1,
              onPageChangeAction: handlePageChange,
            }}
            isLoading={initializing}
            className="w-full"
          />
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {isMobile && displayCount > 0 ? (
            <AnimatePresence>
              <div className="space-y-3">
                {(currentPageUrls as ShortUrl[]).map((url, i) => (
                  <motion.div
                    key={url.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <URLCard
                      url={url}
                      actions={
                        <Actions
                          url={url}
                          className="flex-col w-auto justify-between"
                          itemClassName="w-[24px] aspect-[2/2]"
                        />
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : isMobile && !initializing && displayCount === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <LinkIcon className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">No URLs found</h3>
              <p className="text-slate-500 mt-1 mb-6 max-w-xs mx-auto">
                {isSearchPage 
                  ? "Try a different search term or clear your filters" 
                  : "Create your first shortened URL to see it here"
                }
              </p>
              
              {isSearchPage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchValue("");
                    // handleSearch("");
                    backToUrls()
                  }}
                  className="clear-search"
                >
                  Clear search
                </Button>
              )}
            </motion.div>
          ) : null}
        </div>

        {/* Empty State for Desktop */}
        {!isMobile && !initializing && displayCount === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-dashed p-12 text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <LinkIcon className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No URLs found</h3>
            <p className="text-slate-500 mt-1 mb-6 max-w-md mx-auto">
              {isSearchPage 
                ? "Try a different search term or adjust your filters" 
                : "Get started by creating your first shortened URL"
              }
            </p>
            
            {isSearchPage && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchValue("");
                  backToUrls()
                }}
              >
                Clear search
              </Button>
            )}
          </motion.div>
        )}

        {/* Mobile Pagination */}
        {isMobile && displayCount > 0 && (
          <div className="mt-6 pb-4">
            <CustomPagination
              currentPage={Math.floor(offset / limit) + 1}
              totalPages={totalPages}
              onPageChangeAction={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
