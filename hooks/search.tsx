// import { fetchRequest, parseSearchParams } from "@/app/api/helpers";
// import {
//   FilterCondition,
//   FulltextCondtion,
//   URLResponse,
// } from "@/app/api/types";
// import { UrlData } from "@/app/types";
// import { useAuth } from "@/context/Auth";
// import qs from "qs";
// import { useMemo, useState } from "react";
// import { toast } from "sonner";

// export interface FilterProps {
//   filters: FilterCondition[];
//   limit?: number;
//   offset?: number;
//   sortBy?: string;
//   sortOrder?: "desc" | "asc";
// }
// export const useFilter = ({
//   filters,
//   limit = 10,
//   offset = 0,
//   sortBy = "created_at",
//   sortOrder = "desc",
// }: FilterProps) => {
//   const [results, setResults] = useState<Map<number, UrlData>>(); // We can use some part of the results
// //   const [length, setLength] = useState<number>();

//   const { user } = useAuth();
//   if (!user) {
//     throw new Error("Invalid user");
//   }
//   const uid = user.uid;

//   // No need to recreate filter array - we can use the original
//   const queryString = useMemo (() => qs.stringify(
//     {
//       filters,
//       offset,
//       limit,
//       sort_by: sortBy,
//       sort_order: sortOrder,
//       uid,
//     },
//     {
//       // Configure qs to handle arrays and objects properly
//       arrayFormat: "indices",
//       encode: true,
//       // Limit nesting for cleaner URLs
//       // depth: 4
//     }
//   ),[filters, limit, offset, sortBy, sortOrder, uid]);

//   console.log({ queryString, parsed: parseSearchParams(queryString) });

//   return {
//     queryString,
//     searchUrl: `/q?${queryString}`,
//     params: { filters, offset, limit, sortBy, sortOrder, uid },
//     results,
//   };
// };

