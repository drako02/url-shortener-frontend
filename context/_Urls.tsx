"use client";
import { FilterProps, UrlData } from "@/app/types";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useFetchIntialUrls } from "@/hooks/use-fetch-initial-urls";
import { usePaginatedUrls } from "@/hooks/use-paginated-urls";
import { useUrlFilters } from "@/hooks/use-urls-filters";
import { usePathname } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;
export type UrlContextProps = {
  urls: Map<number, UrlData>;
  totalUrlCount: number;
  initializing: boolean;
  currentQueryString: string;
  loadPage: (limit: number, offset: number) => unknown;
  applyFilter: (
    param: FilterProps | string,
    filterType: "search" | "filter"
  ) => unknown;
  refreshUrls: () => Promise<unknown>
};
const UrlsContext = createContext<UrlContextProps | undefined>(undefined);

export const UrlsProvider = ({ children }: { children: ReactNode }) => {
  const {
    pageUrlMap: initialUrls,
    totalCount: initialUrlTotalCount,
    isLoading: initialLoading,
  } = useFetchIntialUrls(DEFAULT_PAGE_SIZE);

  const {
    pageUrls: paginatedMap,
    isLoading: paginatedLoading,
    loadPage,
    refreshUrls,
    paginatedTotalCount: paginatedUrlTotalCount,
  } = usePaginatedUrls(initialUrlTotalCount);

  const {
    filterQuery,
    filteredList,
    isLoading: filterLoading,
    applyFilter,
    filterResultCount,
  } = useUrlFilters();

  const initializing = initialLoading || paginatedLoading || filterLoading;
  //   const isFiltering = Boolean(filterQuery);

  const pathname = usePathname();
  const _isFiltering = pathname === "/search"; // Update if a filter route is created

  const mainUrls = useMemo(() => {
    return new Map([...initialUrls, ...paginatedMap]);
  }, [initialUrls, paginatedMap]);
  // Check back later !!!!!
  const urls = _isFiltering
    ? new Map(filteredList.map((u, i) => [i, u]))
    : mainUrls;
  console.log("FILTERED LIST IN NEW CONTEXT: ", filteredList);
  /** The total count multiple source of true for the lse of the tenary is
   * because when changes to the urls(creation and deletion) are made the total count of
   * the initialFetch becomes stale and the paginated becomes the up-to-date total
   * But @note we can refactor to set the total from initial urls hook to make things consistent
   */
  const totalUrlCount = _isFiltering
    ? filterResultCount
    : paginatedUrlTotalCount || initialUrlTotalCount;

  const contextValue: UrlContextProps = {
    urls,
    totalUrlCount,
    initializing,
    loadPage,
    applyFilter,
    currentQueryString: filterQuery || "",
    refreshUrls,
  };

  return (
    <UrlsContext.Provider value={contextValue}>{children}</UrlsContext.Provider>
  );
};

export const useUrls = () => {
  const ctx = useContext(UrlsContext);
  if (ctx === undefined) {
    throw new Error("useUrls must be used within UrlsProvider");
  }
  return ctx;
};
