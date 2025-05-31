"use client";
import { FilterProps, UrlData } from "@/app/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  // useMemo,
  useState,
} from "react";
import { useFetchIntialUrls } from "@/hooks/use-fetch-initial-urls";
import { usePaginatedUrls } from "@/hooks/use-paginated-urls";
import { useUrlFilters } from "@/hooks/use-urls-filters";
import { usePathname } from "next/navigation";

const DEFAULT_PAGE_SIZE = 10;
export type UrlContextProps = {
  urls: Map<number, UrlData> | null;
  totalUrlCount: number;
  initializing: boolean;
  currentQueryString: string;
  loadPage: (limit: number, offset: number) => unknown;
  applyFilter: (
    param: FilterProps | string,
    filterType: "search" | "filter"
  ) => unknown;
  refreshUrls: () => Promise<unknown>;
};
const UrlsContext = createContext<UrlContextProps | undefined>(undefined);

export const UrlsProvider = ({ children }: { children: ReactNode }) => {
  // const {
  //   pageUrlMap: initialUrls,
  //   totalCount: initialUrlTotalCount,
  //   isLoading: initialLoading,
  //   loadInitial,
  // } = useFetchIntialUrls(DEFAULT_PAGE_SIZE);

  const {
    pageUrls: paginatedMap,
    isLoading: paginatedLoading,
    loadPage,
    refreshUrls,
    paginatedTotalCount: paginatedUrlTotalCount,
  } = usePaginatedUrls();

  const {
    filterQuery,
    filteredList,
    isLoading: filterLoading,
    applyFilter,
    filterResultCount,
  } = useUrlFilters();

  /** This state and it's effect helps prevent the empty state
   * that shows when the browser renders cached files which results in empty urls
   * example you refresh the page and and before the refresh is done , the browser uses cached files(html, css, js) but this files
   * have no urls.
   */
  const [idle, setIdle] = useState(true);
  // useEffect(() => {
  //   if (!initialLoading && initialUrls) {
  //     setIdle(false);
  //   }
  // }, [initialLoading, initialUrls]);

  useEffect(() => {
    if (!paginatedLoading && paginatedMap) {
      setIdle(false);
    }
  }, [paginatedLoading, paginatedMap]);

  
  // const loadingState =

  const initializing =
    idle || paginatedLoading || filterLoading;
  //   const isFiltering = Boolean(filterQuery);

  const pathname = usePathname();
  const _isFiltering = pathname === "/search"; // Update if a filter route is created

  // const mainUrls = useMemo(() => {
  //   return new Map([...initialUrls, ...paginatedMap]);
  // }, [initialUrls, paginatedMap]);

  // Check back later !!!!!
  const urls = _isFiltering
    ? new Map(filteredList.map((u, i) => [i, u]))
    : paginatedMap;
    
  console.log("FILTERED LIST IN NEW CONTEXT: ", filteredList);
  /** The total count multiple source of true for the else  part of the tenary is
   * because when changes to the urls(creation and deletion) are made the total count of
   * the initialFetch becomes stale and the paginated becomes the up-to-date total
   * But @note we can refactor to set the total from initial urls hook to make things consistent
   */
  const totalUrlCount = _isFiltering
    ? filterResultCount
    : paginatedUrlTotalCount;

    // Since we are using the etotal of intialUrls, when total changes from the paginated urls, we have to get the current urls from the initial
// useEffect(() => {
//   if(_isFiltering) return
//  if(totalUrlCount !== paginatedUrlTotalCount ){
//   loadInitial()
//  }

// },[_isFiltering, loadInitial, paginatedUrlTotalCount, totalUrlCount])

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
