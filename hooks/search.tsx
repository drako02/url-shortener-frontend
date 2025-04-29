import { fetchRequest, parseSearchParams } from "@/app/api/helpers";
import {
  FilterCondition,
  FulltextCondtion,
  URLResponse,
} from "@/app/api/types";
import { UrlData } from "@/app/types";
import { useAuth } from "@/context/Auth";
import qs from "qs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface FilterProps {
  filters: FilterCondition[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}
export const useFilter = ({
  filters,
  limit = 10,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc",
}: FilterProps) => {
  const [results, setResults] = useState<Map<number, UrlData>>(); // We can use some part of the results
//   const [length, setLength] = useState<number>();

  const { user } = useAuth();
  if (!user) {
    throw new Error("Invalid user");
  }
  const uid = user.uid;
//   console.log(filters)

  //   const filtersArr: FilterCondition[] = [];

  //   filters.forEach((filter) => {
  //     if (filter.operator === "fulltext") {
  //       const fieldsArray: string[] = [];
  //       (filter as FulltextCondtion).fields.forEach((str) => {
  //         fieldsArray.push(str);
  //       });
  //       filtersArr.push({
  //         fields: fieldsArray,
  //         operator: "fulltext",
  //         value: filter.value,
  //       });
  //       return;
  //     }

  //     filtersArr.push({
  //       field: filter.field,
  //       operator: filter.operator,
  //       value: filter.value,
  //     });
  //   });

  //   const queryString = qs.stringify(
  //     { filters: filtersArr, offset, limit, sortBy, sortOrder, uid },
  //     { arrayFormat: "brackets", encode: true},
  //   );

  // No need to recreate filter array - we can use the original
  const queryString = useMemo (() => qs.stringify(
    {
      filters,
      offset,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
      uid,
    },
    {
      // Configure qs to handle arrays and objects properly
      arrayFormat: "indices",
      encode: true,
      // Limit nesting for cleaner URLs
      // depth: 4
    }
  ),[filters, limit, offset, sortBy, sortOrder, uid]);

  console.log({ queryString, parsed: parseSearchParams(queryString) });

//   const fetchUrls = async () => {
//     try {
//       const res = await fetchRequest<{ urls: URLResponse[]; count: number }>(
//         "/api/urls",
//         { method: "POST", body: JSON.parse(queryString) }
//       );

//       console.log("search data: ", res);

//       setResults(() => {
//         const newMap = new Map();
//         res.urls.forEach((url, index) => newMap.set(index, url));
//         return newMap;
//       });
//     //   setLength(res.count);
//     } catch (error) {
//       console.error("Error fetching URLs:", error);
//       toast.error("Failed to load URLs. Please try again.");
//     }
//   };

  return {
    queryString,
    searchUrl: `/q?${queryString}`,
    params: { filters, offset, limit, sortBy, sortOrder, uid },
    results,
    length,
  };
};

// export const parseSearchParams = (queryString: string) => {
//   const parsed = qs.parse(queryString, {
//     ignoreQueryPrefix: true,
//   });

// //   return {
// //     filters: parsed.filters as FilterCondition[],
// //     limit: Number(parsed.limit) || 10,
// //     offset: Number(parsed.offset) || 0,
// //     sortBy: (parsed.sortBy as string) || "created_at",
// //     sortOrder: (parsed.sortOrder as "desc" | "asc") || "desc",
// //   };

// return parsed
// };

// const useSearch = (value: string) => {

// }
