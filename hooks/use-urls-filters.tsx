import { fetchRequest, parseSearchParams } from "@/app/api/helpers";
import { FilterOperator, URLResponse } from "@/app/api/types";
import { FilterProps, UrlData } from "@/app/types";
import { useAuth } from "@/context/Auth";
import { buildFilterQuery, safeFetch } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useUrlFilters = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filteredList, setFilteredList] = useState<UrlData[]>([]);
  // Length of the filter query result (without offset)
  const [filterResultCount, setFilterResultCount] = useState<number>(0);
  /**
   * @constant filterValue and @constant filterOperators will be used to determine if we should
   * cache maintain/cache old filter values. If they change we have to clear cache if they don't - implify same filter
   * we cache.
   * Remember to apply the cache through the code / in the context
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterValue, setFilterValue] = useState<unknown[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterOperators, setFilterOperators] = useState<FilterOperator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { user } = useAuth();

  /** The string type of the param might never be used, if it's used handle
   * the case for building the setting the filter query
   */
  const applyFilter = useCallback(
    async (param: FilterProps | string, filterType: "search" | "filter") => {
      console.log("APPLYFILTER CALLED");
      if (!user) return;

      let values;
      let operators;
      let currentQuery;

      if (typeof param !== "string") {
        currentQuery = `${filterType}?` + buildFilterQuery(param);
        setFilterQuery(currentQuery);

        // for "between" filter operators two values are required
        values = param.filters.map((f) => {
          if (f.operator !== "fulltext" && f.values) {
            return f.values;
          }
          return f.value;
        });
        setFilterValue(values);

        operators = param.filters.map((f) => f.operator);
        setFilterOperators(operators);

        console.log("BUILT QUERY", currentQuery);
      }

      setIsLoading(true);

      const res = await safeFetch(
        () =>
          fetchRequest<{ urls: URLResponse[]; length: number }>("/api/urls", {
            method: "POST",
            body:
              typeof param === "string"
                ? { ...parseSearchParams(param), uid: user.uid }
                : { ...param, uid: user.uid },
          }),
        "Filter URLs"
      );

      if (res) {
        setFilteredList(res.urls);
        setFilterResultCount(res.length);
      }

      router.push(`/${currentQuery}`);
      setIsLoading(false);
    },
    [router, user]
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qsFromParams = searchParams.toString()

  //Remember to update the offset on the urlspage
  useEffect(() => {
    if (!user) return;
    // Might have to check other filter paths
    if (pathname === "/search" && filteredList.length === 0 && !filterQuery) {
        setIsLoading(true)

      safeFetch(
        () =>
          fetchRequest<{ urls: URLResponse[]; length: number }>("/api/urls", {
            method: "POST",
            body: {
              ...parseSearchParams(qsFromParams),
              uid: user.uid,
            },
          }),
        "Filter URLs"
      ).then((res) => {
        if (res) {
          setFilteredList(res.urls);
          setFilterResultCount(res.length);
          setFilterQuery(`${pathname.slice(1)}?` +qsFromParams)
        }
        setIsLoading(false)
      });
      console.log("SEARCH PARAMS: ", qsFromParams);
    }
  }, [filterQuery, filteredList.length, pathname, qsFromParams, user]);

  return {
    filterQuery,
    filteredList,
    isLoading,
    applyFilter,
    filterResultCount,
  };
};
