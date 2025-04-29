"use client";
import { fetchRequest, mapToURL, parseSearchParams, URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { FilterCondition, ShortUrl, UrlQuery, URLResponse } from "@/app/api/types";
import { UrlData } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/Auth";
import { useUrls } from "@/context/Urls";
import { useFilter } from "@/hooks/search";
import { SearchInput } from "@/mycomponents/input/searchInput";
import { TableComponent } from "@/mycomponents/table/table";
import {
  BodyCellProps,
  HeaderContentProps,
  RowContentProps,
} from "@/mycomponents/table/types";
import { format, formatDistance } from "date-fns";
import { Copy, Link as LinkIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function UserUrls() {
  const { urls, updateUrls, allUrlsTotal, initializing } = useUrls();
  const [offset, setOffset] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("")
  // const [filterUrls, setFilterUrls] = useState<Map<number, UrlData>>(
  //   new Map<number, UrlData>()
  // );

  console.log({searchValue})

  // const [queryTotal, setQueryTotal] = useState<number>(0)
  const limit = 10;
  const { queryString, results} = useFilter({filters: [{fields:["short_code", "long_url"], value: searchValue, operator:"fulltext"}], limit, offset})


  const router = useRouter();
  const pathName = usePathname();

  // useEffect(() => {
  //   upda
  // })
  useEffect(() => {
    if (pathName === "/user-urls") {
      const initializeUrls = async () => updateUrls(limit, offset);
      initializeUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  //Pagination
  const totalPages = useMemo(() => {
    // const totalToUse = pathName === "/search" ? queryTotal : allUrlsTotal
    return Math.ceil(allUrlsTotal / limit);
  }, [allUrlsTotal]);

  const handlePageChange = (page: number) => {
    console.log({ page });
    setOffset((page - 1) * limit);
  };

  const tableHeaders: HeaderContentProps = [
    {
      label: "ID",
    },
    {
      label: "Short Url",
    },
    {
      label: "Original",
    },
    {
      label: "CreatedAt",
    },
    { label: "Actions" },
  ];

  const Actions = ({ url }: { url: ShortUrl }) => {
    return (
      <div className="flex w-[80px] h-full">
        <Button
          asChild
          variant="ghost"
          className="h-[24px] p-1"
          onClick={() =>
            navigator.clipboard.writeText(
              `${URL_SERVICE_API_BASE_URL}/${url.shortCode}`
            )
          }
        >
          <Copy size={"50%"} />
        </Button>
        <Button
          asChild
          variant="ghost"
          className="h-[24px] p-1"
          onClick={() => toast("To be deleted")}
        >
          <Trash2 size={"50%"} />
        </Button>
      </div>
    );
  };

  // Process table data for URL display
  const currentPageUrls: RowContentProps[] = useMemo(() => {
    // const urlsToUse = pathName === "/search" ? filterUrls : urls
    return Array.from({ length: limit })
      .map((_, i) => {
        return (urls).get(offset + i);
      })
      .filter((url): url is URLResponse => url !== undefined)
      .map((url) => mapToURL(url))
      .map((url): BodyCellProps[] => {
        const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
        const dateCreated = new Date(url.createdAt);
        const ageInMs = Date.now() - dateCreated.getTime();

        const dateDisplay =
          ageInMs < FOUR_DAYS_MS
            ? formatDistance(dateCreated, new Date(), { addSuffix: true })
            : format(dateCreated, "PPp");

        return [
          { label: "#" + url.id.toString() },
          {
            element: (
              <Link
                href={`${URL_SERVICE_API_BASE_URL}/${url.shortCode}`}
                className="flex gap-1 items-center"
              >
                {" "}
                <LinkIcon size="12" />
                {`${URL_SERVICE_API_BASE_URL}/${url.shortCode}`}
              </Link>
            ),
            tooltipContent: `${URL_SERVICE_API_BASE_URL}/${url.shortCode}`,
          },
          { label: url.originalUrl },
          { label: dateDisplay },
          { element: <Actions url={url} /> },
        ];
      });
  }, [offset, urls]);

  // Search and Filtering
  // const { user } = useAuth();
  //   const params = useSearchParams();
    // const pathName = usePathname();
  
    // const parsedFilters = useMemo<FilterCondition[]>(() => {
    //   try {
    //     const filtersParam = params.get("filters");
    //     if (filtersParam) {
    //       return JSON.parse(filtersParam);
    //     }
    //   } catch (error) {
    //     console.error("Error parsing filters:", error);
    //   }
    //   return [];
    // }, [params]);
  
    // const urlParams = useMemo(() =>Object.fromEntries(params.entries()),[params]);
  
  // Create query object cleanly
    // const query = useMemo<UrlQuery>(() => {
    //   const allParams = { ...urlParams, filters: parsedFilters };
    //   return {
    //     ...allParams,
    //     uid: user?.uid || "",
    //     limit: 10,
    //   };
    // }, [urlParams, parsedFilters, user?.uid]);

    // console.log("search page params: ", parsedFilters);
    // console.log("search page query: ", query);
    // console.log({ pathName });

    // useEffect(() => {
    //   if(pathName != "/search"){
    //     return
    //   }
      
    //   (async () => await updateUrls(limit, offset, queryString))();
    // }, [offset, pathName, updateUrls]);

  useEffect(() => {
    // if (pathName != "/user-urls") {
    //   return;
    // }
    if(pathName !== "/user-urls"){
      updateUrls(limit, offset, queryString)
      router.push(`/search?${queryString}`)
      return 
    }
    const currentPage = Math.floor(offset / limit) + 1;
    if (currentPage > 1) {
      const fetchUrlsForRequestedPage = async () => {
        // if (pathName != "/user-urls") {
        //   await updateUrls(limit, offset, queryString);
        //   return
        // }
        await updateUrls(limit, offset);
      };
      fetchUrlsForRequestedPage();
    }
        /// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, pathName]);

  // console.log("new query string: ", queryString, results)

  console.log({ pathName });
  const handleSearch = async (value: string) => {
    // const filter = [
    //   { fields: ["long_url", "short_code"], operator: "fulltext", value },
    // ];

    // const searchParams = new URLSearchParams({
    //   filters: JSON.stringify(filter),
    // });
    // router.push(`/search?${searchParams}&sort_by=short_code&sort_order=desc`);
    setOffset(0)
    await updateUrls(limit, offset, queryString)
    console.log("offfseeeettt: ", offset)
    router.push(`/search?${queryString}`);

  };

  console.log("URL LENGTH: ", allUrlsTotal)
  console.log("URLS: ", urls)
  return (
    <div className=" h-full w-full flex flex-col justify-start items-center pt-[1%]">
      <div className="flex w-[95%] justify-end">
        <SearchInput onSearch={handleSearch} onChange={setSearchValue}/>
      </div>
      <TableComponent
        headers={tableHeaders}
        rows={currentPageUrls}
        pagination={{
          totalPages,
          currentPage: Math.floor(offset / limit) + 1,
          onPageChangeAction: handlePageChange,
        }}
        isLoading={initializing}
        className="w-[95%]"
      />
    </div>
  );
}
