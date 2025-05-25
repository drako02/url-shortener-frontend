import { getShortUrls } from "@/app/api/urls/urls";
import { UrlData } from "@/app/types";
import { useAuth } from "@/context/Auth";
import { safeFetch } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

/**
 * This hook is used to fetch first set of urls when app loads
 *  @param pageSize The number of URLs to fetch per page
 **/
export const useFetchIntialUrls = (pageSize: number = 10) => {
  const [pageUrlMap, setPageUrlMap] = useState<Map<number, UrlData>>(new Map());
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user, initializing: userInitializing } = useAuth();

  const loadInitial = useCallback(async () => {
    setIsLoading(true);

    // if (userInitializing) setIsLoading(true);
    if (!user ) {
      setIsLoading(false);
      return;
    }
    const data = await safeFetch(
      () => getShortUrls(user.uid, pageSize, 0),
      "Fetch initial urls"
    );
    console.log("DATA: ", data);
    if (data) {
      setTotalCount(data.recordCount);
      const map = new Map<number, UrlData>();
      data.urls.forEach((url, index) => map.set(index, url));
      setPageUrlMap(map);
    }
    setIsLoading(false);
  }, [pageSize, user]);

  /** Used to update the total url count when it changes -
   * usually from creating a new url or when there's an update in total urls when paginating
   */
  const updateTotalCount = useCallback((value: number) => {
    setTotalCount(value);
    console.log("setTotalCount was set", {totalCount, value})
  }, [totalCount]);
  console.log("TOTAL COUUNT FROM INITIAL URL: ", totalCount)

  useEffect(() => {
    loadInitial();
    console.log("loadInitial called");
  }, [loadInitial]);

  console.log("INITIAL URLS FROM HOOK: ", pageUrlMap);

  return { pageUrlMap, totalCount, isLoading, loadInitial, updateTotalCount };
};
