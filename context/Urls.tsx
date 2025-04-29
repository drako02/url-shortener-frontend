"use client";
import { getShortUrls } from "@/app/api/urls/urls";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./Auth";
import { fetchRequest, logError, parseSearchParams } from "@/app/api/helpers";
import { UrlContextProps, UrlData } from "@/app/types";
import { usePathname } from "next/navigation";
import { URLResponse } from "@/app/api/types";
import { toast } from "sonner";

const UrlsContext = createContext<UrlContextProps>({
  urls: new Map(),
  allUrlsTotal: 0,
  initializing: false,
  updateUrls: async () => {},
});

export const UrlsProvider = ({ children }: { children: React.ReactNode }) => {
  // const [urls, setUrls] = useState<UrlData[]>([]);
  const [urls, setUrls] = useState<Map<number, UrlData>>(
    new Map<number, UrlData>()
  );

  const [initializing, setInitializing] = useState<boolean>(true);
  const [allUrlsTotal, setAllUrlsTotal] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<boolean>(false);

  const pathName = usePathname()

  const { user } = useAuth();
  const INITIAL_URLS_LIMIT = 10;
  // console.log("lkjhfdd", urls)
  useEffect(() => {
    const fetchInitialUrls = async () => {
      try {
        if (initializing === false) setInitializing(true);

        if (!user) return;

        const { urls: fetchedUrls, recordCount } = await getShortUrls(
          user.uid,
          INITIAL_URLS_LIMIT,
          0
        );
        console.log("Provider urls: ", fetchedUrls);

        setAllUrlsTotal(recordCount);
        setUrls(() => {
          const newMap = new Map();
          fetchedUrls.forEach((url, index) => newMap.set(index, url));
          return newMap;
        });
      } catch (error) {
        logError({
          context: " Fetching urls for Urls context provider",
          error,
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch user urls",
          logLevel: "error",
        });
      } finally {
        setInitializing(false);
      }
    };

    fetchInitialUrls();
    console.log("user in url provider: ", user);
  }, [user]);

  const updateUrls = useCallback(
    async (limit: number, offset: number, queryString?: string) => {
      console.log("update urls called");
      console.log("OFFSET: ", offset);
      if(queryString){
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        setFilterMode(true)
        urls.clear()
        // setAllUrlsTotal(0)
      }
      if(!queryString && filterMode){
        setFilterMode(false)
        urls.clear()
        // setAllUrlsTotal(0)
      }

      try {
        setInitializing(true);
        if (!user) return;
        console.log({ allUrlsTotal, urlsMapSize: urls.size });

        const pageSize = Math.min(limit, allUrlsTotal - offset);
        const hasDataForRequestedRange =
          urls.size === allUrlsTotal ||
          Array.from({ length: pageSize }).every((_, i) =>
            urls.has(offset + i)
          );
      
        console.log("update urls called got here");
        if (!filterMode && hasDataForRequestedRange) return;

        console.log("update urls called got herrrre??");

        let recordCount:number;
        let newUrls:URLResponse[];

        if(!queryString ){
          const { recordCount: _recordCount, urls } = await getShortUrls(
            user.uid,
            limit,
            offset
          );
          recordCount = _recordCount;
          newUrls = urls;
        } else {
          console.log("filter update func called")
          const res = await fetchFilterUrlsUrls(queryString) ?? { length: 0, urls: [] };
          recordCount = res.length;
          newUrls = res.urls
          console.log({"filter content": [res.length, res.urls, queryString]})


        }


        // Update the total count if needed
        if (recordCount !== allUrlsTotal) {
          console.log("update urls called recordCount check");

          setAllUrlsTotal(recordCount);
        }

        setUrls((prevMap) => {
          const newMap = new Map(prevMap);
          newUrls.forEach((url, index) => newMap.set(offset + index, url));
          return newMap;
        });
      } catch (error) {
        logError({
          context: "Updating urls in Urls context provider",
          error,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update user urls",
          logLevel: "error",
        });
      } finally {
        setInitializing(false);
      }
    },
    [allUrlsTotal, filterMode, urls, user]
  );

  const fetchFilterUrlsUrls = async (queryString: string) => {
    try {
      const res = await fetchRequest<{ urls: URLResponse[]; length: number }>(
        "/api/urls",
        { method: "POST", body: parseSearchParams(queryString) }
      );
      console.log("endres",res)
      return res
    } catch (error) {
        console.error("Error fetching URLs:", error);
        toast.error("Failed to load URLs. Please try again.");
    }
  };

  return (
    <UrlsContext.Provider
      value={{ urls, initializing, updateUrls, allUrlsTotal }}
    >
      {children}
    </UrlsContext.Provider>
  );
};

export const useUrls = () => {
  const context = useContext(UrlsContext);
  if (context === undefined) {
    throw new Error("useUrls must be used in a UrlsProvider");
  }
  return context;
};
