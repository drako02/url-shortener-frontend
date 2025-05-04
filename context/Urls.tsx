// "use client";
// import { getShortUrls } from "@/app/api/urls/urls";
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useAuth } from "./Auth";
// import { fetchRequest, logError, parseSearchParams } from "@/app/api/helpers";
// import { FilterProps, UrlContextProps, UrlData } from "@/app/types";
// import { URLResponse } from "@/app/api/types";
// import { toast } from "sonner";
// import qs from "qs";
// import { usePathname } from "next/navigation";

// const UrlsContext = createContext<UrlContextProps>({
//   urls: new Map(),
//   totalUrlCount: 0,
//   initializing: true,
//   updateUrls: async () => {},
//   filter: () => ({ queryString: "" }),
//   currentQueryString: "",
//   isNavigating: false,
//   setNavigatingState: () => {},
// });

// export const UrlsProvider = ({ children }: { children: React.ReactNode }) => {
//   const [urls, setUrls] = useState<Map<number, UrlData>>(
//     new Map<number, UrlData>()
//   );

//   const urlsRef = useRef<Map<number, UrlData>>(urls);

//   const [initializing, setInitializing] = useState<boolean>(true);
//   const [totalUrlCount, setTotalUrlCount] = useState<number>(0);
//   const filterModeRef = useRef(false);
//   const [currentQueryString, setCurrentQueryStrng] = useState<string>("");
//   const [isNavigating, setIsNavigating] = useState<boolean>(false);
//   // const [filterItems, setFilterItems] = useState<{
//   //   queryString: string;
//   //   params: FilterProps
//   // }>({
//   //   queryString: '',
//   //   params: {
//   //     filters: []
//   //   }
//   // });

//   const totalUrlCountRef = useRef<number>(totalUrlCount);

//   useEffect(() => {
//     urlsRef.current = urls;
//     totalUrlCountRef.current = totalUrlCount;
//   }, [totalUrlCount, urls]);

//   useEffect(() => {
//     console.log("UrlsProvider initializing state:", initializing);
//   }, [initializing]);

//   // const params = useSearchParams()
//   // useEffect(() => {
//   //   return () => {
//   //     if (params) setInitializing(true);
//   //   };
//   // }, [params]);

//   const pathName = usePathname();
//   const { user } = useAuth();
//   const INITIAL_URLS_LIMIT = 10;
//   useEffect(() => {
//     if (pathName !== "/search") {
//       const fetchInitialUrls = async () => {
//         try {
//           if (initializing === false) setInitializing(true);

//           if (!user) return;

//           const { urls: fetchedUrls, recordCount } = await getShortUrls(
//             user.uid,
//             INITIAL_URLS_LIMIT,
//             0
//           );

//           setTotalUrlCount(recordCount);
//           setUrls(() => {
//             const newMap = new Map();
//             fetchedUrls.forEach((url, index) => newMap.set(index, url));
//             return newMap;
//           });
//         } catch (error) {
//           logError({
//             context: " Fetching urls for Urls context provider",
//             error,
//             message:
//               error instanceof Error
//                 ? error.message
//                 : "Failed to fetch user urls",
//             logLevel: "error",
//           });
//         } finally {
//           setInitializing(false);
//         }
//       };

//       fetchInitialUrls();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, pathName]);
//   const updateUrlsCallCountRef = useRef(0);

//   const updateUrls = useCallback(
//     async (limit: number, offset: number, queryString?: string) => {
//       updateUrlsCallCountRef.current += 1;
//       console.log({ updateUrlsCallCountRef });
//       setInitializing(true);

//       try {
//         if (!user) {
//           return;
//         }
//         if (queryString) {
//           filterModeRef.current = true;
//         }

//         if (!queryString && filterModeRef.current) {
//           filterModeRef.current = false;
//           // urls.clear();
//           setUrls(new Map());
//         }

//         const existingUrls = urlsRef.current;
//         const pageSize = Math.min(limit, totalUrlCountRef.current - offset);
//         const hasDataForRequestedRange =
//           // urls.size === allUrlsTotal ||
//           pageSize > 0 &&
//           Array.from({ length: pageSize }).every((_, i) =>
//             existingUrls.has(offset + i)
//           );

//         if (!filterModeRef.current && hasDataForRequestedRange) return;

//         let recordCount: number;
//         let newUrls: URLResponse[];

//         if (!queryString) {
//           const { recordCount: _recordCount, urls } = await getShortUrls(
//             user.uid,
//             limit,
//             offset
//           );
//           recordCount = _recordCount;
//           newUrls = urls;
//         } else {
//           const res = (await fetchFilterUrlsUrls(queryString)) ?? {
//             length: 0,
//             urls: [],
//           };
//           recordCount = res.length;
//           newUrls = res.urls;

//           setUrls(new Map());
//         }

//         // Update the total count if needed
//         if (recordCount !== totalUrlCountRef.current) {
//           setTotalUrlCount(recordCount);
//         }

//         setUrls((prevMap) => {
//           const newMap = new Map(prevMap);
//           newUrls.forEach((url, index) => newMap.set(offset + index, url));
//           return newMap;
//         });
//       } catch (error) {
//         logError({
//           context: "Updating urls in Urls context provider",
//           error,
//           message:
//             error instanceof Error
//               ? error.message
//               : "Failed to update user urls",
//           logLevel: "error",
//         });
//       } finally {
//         setInitializing(() => {
//           console.log("Initialization state did set in finally");
//           return false;
//         });

//         console.log(
//           "Navigation state before setState in finally: ",
//           isNavigating
//         );
//         if (isNavigating) {
//           setIsNavigating(() => {
//             console.log("Navigation state did set in finally");
//             return false;
//           });
//         }
//       }
//     },
//     [isNavigating, user]
//   );

//   const fetchFilterUrlsUrls = async (queryString: string) => {
//     try {
//       const res = await fetchRequest<{ urls: URLResponse[]; length: number }>(
//         "/api/urls",
//         { method: "POST", body: parseSearchParams(queryString) }
//       );
//       return res;
//     } catch (error) {
//       console.error("Error fetching URLs:", error);
//       toast.error("Failed to load URLs. Please try again.");
//     }
//   };

//   const filter = useCallback(
//     (props: FilterProps) => {
//       const { filters, offset, limit, sortBy, sortOrder } = props;
//       if (!user) {
//         throw new Error("Invalid user");
//       }
//       const uid = user.uid;
//       const queryString = qs.stringify(
//         {
//           filters,
//           offset,
//           limit,
//           sort_by: sortBy,
//           sort_order: sortOrder,
//           uid,
//         },
//         {
//           // Configure qs to handle arrays and objects properly
//           arrayFormat: "indices",
//           encode: true,
//           // Limit nesting for cleaner URLs
//           // depth: 4
//         }
//       );

//       setCurrentQueryStrng(queryString);
//       // setFilterItems({params: props, queryString})
//       return { queryString };
//     },
//     [user]
//   );

//   const setNavigatingState = useCallback((state: boolean) => {
//     setIsNavigating(state);
//   }, []);

//   const value = useMemo(
//     () => ({
//       urls,
//       initializing,
//       updateUrls,
//       totalUrlCount,
//       filter,
//       currentQueryString,
//       isNavigating,
//       setNavigatingState,
//     }),
//     [urls, initializing, updateUrls, totalUrlCount, filter, currentQueryString, isNavigating, setNavigatingState]
//   );
//   return <UrlsContext.Provider value={value}>{children}</UrlsContext.Provider>;
// };

// export const useUrls = () => {
//   const context = useContext(UrlsContext);
//   if (context === undefined) {
//     throw new Error("useUrls must be used in a UrlsProvider");
//   }
//   return context;
// };
