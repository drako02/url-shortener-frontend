import { fetchRequest, logError } from "@/app/api/helpers";
import { getShortUrls } from "@/app/api/urls/urls";
import { UrlData } from "@/app/types";
import { useAuth } from "@/context/Auth";
import { safeFetch } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fetches urls for a requested
 * @param totalCount The total urls count for the current user
 **/
export const usePaginatedUrls = () => {
  const [pageUrls, setPageUrls] = useState<Map<number, UrlData> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalUrlCount, setTotalUrlCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<{
    limit: number;
    offset: number;
  } | null>(null);

  const urlCacheRef = useRef<Map<number, UrlData> | null>(new Map());

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    urlCacheRef.current = pageUrls;
  }, [pageUrls]);

  useEffect(() => {
    if(!isAuthenticated){
      setPageUrls(new Map())
    }
  }, [isAuthenticated])

  console.log({ pageUrls });
  const loadPage = useCallback(
    async (limit: number, offset: number) => {
      if (!user) return;

      setCurrentPage({ limit, offset });

      // Handles cases where last page might be lest that the limit
      const pageSize = Math.min(limit, totalUrlCount - offset);

      // skip fetch if we already have data in state
      // page size can be >= 0 depending on offset value
      const alreadyLoaded =
        // offset === 0 ||
        (pageSize > 0 &&
          Array.from({ length: pageSize }).every((_, i) =>
            urlCacheRef.current?.has(offset + i)
          ));
      if (alreadyLoaded) return;

      setIsLoading(true);

      const data = await safeFetch(
        () => getShortUrlsWithClicks(user.uid, limit, offset),
        "Fetch paginated urls"
      );

      if (data) {
        const cache = new Map(urlCacheRef.current);
        data.urls.forEach((url, index) => cache.set(offset + index, url));
        urlCacheRef.current = cache;

        setPageUrls((prev) => {
          const m = new Map(prev);
          data.urls.forEach((url, index) => m.set(offset + index, url));
          return m;
        });

        if (totalUrlCount !== data.recordCount) {
          setTotalUrlCount(data.recordCount);
        }
      }

      setIsLoading(false);
    },
    [totalUrlCount, user]
  );

  const refreshUrls = useCallback(async () => {
    if (!user || !currentPage) return;

    // Clear the cache for the current page range
    const { limit, offset } = currentPage;
    const cache = new Map(urlCacheRef.current);

    for (let i = 0; i < limit; i++) {
      cache.delete(offset + i);
    }
    urlCacheRef.current = cache;

    setPageUrls(() => {
      loadPage(limit, offset);
      return cache;
    });


    // Reload the current page
  }, [user, currentPage, loadPage]);

  return {
    pageUrls,
    isLoading,
    loadPage,
    refreshUrls,
    paginatedTotalCount: totalUrlCount,
  };
};

// export const deleteUrl = async (id: number, auth: Auth) => {
//   try {
//     if (!auth.currentUser) {
//       throw new Error("User not authenticated");
//     }

//     const token = await auth.currentUser.getIdToken();

//     const res = await fetchRequest("/api/urls/", {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//       body: { id },
//     });

//     return { success: true, data: res, error: null };
//   } catch (error) {
//     logError({
//       context: "deleting url",
//       error,
//       message: "",
//       logLevel: "error",
//     });
//     return { success: false, data: null, error };
//   }
// };

const getUrlClickCount = async (
  shortcode: string,
  handleError?: (error: unknown) => unknown
) => {
  try {
    const res = await fetchRequest<{ data: number }>(
      `/api/visits?shortcode = ${shortcode}`,
      {}
    );
    return res.data;
  } catch (error) {
    logError({
      context: "Fetching URL click count",
      error,
      message: "Failed to get click count for URL",
      logLevel: "error",
    })
    if (handleError) {
      handleError(error);
    } 
  }
};

const getShortUrlsWithClicks = async (
  uid: string,
  limit?: number,
  offset?: number
) => {
  const urls = await getShortUrls(uid, limit, offset);
  const withClicks = await Promise.all(urls.urls.map(async (u) => {
      const clickCount = await getUrlClickCount(u.short_code);
      return { ...u, clicks: clickCount };
    }))

  // const urlsWithClicks = {
  //   recordCount: urls.recordCount,
  //   urls: await Promise.all(urls.urls.map(async (u) => {
  //     const clickCount = await getUrlClickCount(u.short_code);
  //     return { ...u, clicks: clickCount };
  //   })),
  // };

  const urlsWithClicks = {
    recordCount: urls.recordCount,
    urls: withClicks,
  };


  return urlsWithClicks
  //TODO continie with create a utility function for the getShortUrl function that inserts the
  //visits/clicks
};
