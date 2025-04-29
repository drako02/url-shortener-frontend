"use client";

import { fetchRequest } from "@/app/api/helpers";
import { FilterCondition, UrlQuery, URLResponse } from "@/app/api/types";
import { useAuth } from "@/context/Auth";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import UserUrls from "../user-urls/page";
import { useFilter } from "@/hooks/search";

export default function Search() {
  // useFilter({filters:[{operator: "fulltext", value: "hello", fields:["short_code, long_url"]}, {operator: "fulltext", value: "hello", fields:["short_code, long_url"]}, {operator:"between", field: "created_at", value: "kkk"}]})
  // const { user } = useAuth();
  // const params = useSearchParams();
  // const pathName = usePathname();

  // let parsedFilters: FilterCondition[] = [];
  // try {
  //   const filtersParam = params.get("filters");
  //   if (filtersParam) {
  //     parsedFilters = JSON.parse(filtersParam);
  //   }
  // } catch (error) {
  //   console.error("Error parsing filters:", error);
  // }

  // const urlParams = Object.fromEntries(params.entries());

  // const allParams = { ...urlParams, filters: parsedFilters}

  // // Create query object cleanly
  // const query: UrlQuery = {
  //   ...allParams,
  //   uid: user?.uid || "",
  //   limit: 10,
  // };
  // console.log("search page params: ", parsedFilters);
  // console.log("search page query: ", query);
  // console.log({ pathName });
  // useEffect(() => {
  //   const fetchUrls = async () => {
  //     try {
  //       const res = await fetchRequest<{ urls: URLResponse; count: number }>(
  //         "/api/urls",
  //         { method: "POST", body: query }
  //       );
  //       console.log("search data: ", res);
  //     } catch (error) {}
  //   };

  //   fetchUrls();
  // }, []);

  return <UserUrls/>;
}
