import { getShortUrls } from "@/app/api/urls/urls";
import { UrlData } from "@/app/types";
import { useAuth } from "@/context/Auth";
import { safeFetch } from "@/lib/utils";
import { useCallback, useState } from "react";

/**
 * Fetches urls for a requested
 * @param totalCount The total urls count for the current user
 **/
export const usePaginatedUrls = (totalCount: number) => {
  const [pageUrls, setPageUrls] = useState<Map<number, UrlData>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { updateTotalCount, totalCount: initialTotalCount } =
//     useFetchIntialUrls();
const [paginatedTotalCount, setTotalCount] = useState<number>(0);

  const { user } = useAuth();

  const loadPage = useCallback(
    async (limit: number, offset: number) => {
      console.log("LOADPAGE CALLED");
      if (!user) return;

      // Handles cases where last page might be lest that the limit
      const pageSize = Math.min(limit, totalCount - offset);

      // skip fetch if we already have data in state
      // page size can be >= 0 depending on offset value
      const alreadyLoaded =
        pageSize > 0 &&
        Array.from({ length: pageSize }).every((_, i) =>
          pageUrls.has(offset + i)
        );
      console.log({ alreadyLoaded, pageUrls, pageSize }, offset);
      if (alreadyLoaded) return;
      console.log("LOAD PAGE PASSED RETURN");

      setIsLoading(true);

      const data = await safeFetch(
        () => getShortUrls(user.uid, limit, offset),
        "Fetch paginated urls"
      );

      if (data) {
        setPageUrls((prev) => {
          const m = new Map(prev);
          data.urls.forEach((url, index) => m.set(offset + index, url));
          return m;
        });

        console.log({totalCount, "data count":data.recordCount})
        if (totalCount !== data.recordCount) {
          setTotalCount(data.recordCount);
          console.log("data.recordCount: ", data.recordCount, )
        }
      }

      setIsLoading(false);
    },
    [pageUrls, totalCount, user]
  );

  return { pageUrls, isLoading, loadPage, paginatedTotalCount };
};
