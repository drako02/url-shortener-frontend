"use client";
import { mapToURL, URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { ShortUrl, URLResponse } from "@/app/api/types";
import { useUrls } from "@/context/_Urls";

import { SearchInput } from "@/mycomponents/input/searchInput";
import { TableComponent } from "@/mycomponents/table/table";
import {
  BodyCellProps,
  HeaderContentProps,
  RowContentProps,
} from "@/mycomponents/table/types";
import { format, formatDistance } from "date-fns";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Actions } from "../url/URLActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { URLCard } from "../card/card";

export default function UserUrls() {
  const { urls, totalUrlCount, initializing, loadPage, applyFilter } =
    useUrls();
  const [offset, setOffset] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const isMobile = useIsMobile();

  const limit = 10;

  // const router = useRouter();
  const pathName = usePathname();

  //Pagination
  const totalPages = useMemo(() => {
    console.log("TOTAL URL COUNT FROM URLS COMPONENT: ", totalUrlCount);
    return Math.ceil(totalUrlCount / limit);
  }, [totalUrlCount]);

  const params = useSearchParams();

  /** Since we router.push when filtering states get reset and offset value and search
   * value resets so we have to set these from the search params
   */
  useEffect(() => {
    // Get search value from URL params
    if (pathName !== "/user-urls") {
      const searchParam = params.get("filters[0][value]");
      const searchOffset = params.get("offset");

      if (searchParam) {
        setSearchValue(searchParam);
        // setSearchValue(searchParam);
      }

      if (searchOffset) {
        setOffset(Number(searchOffset));
      }
    }
  }, [params, pathName]);

  useEffect(() => {
    if (pathName === "/user-urls") {
      loadPage(limit, offset);
    }
  }, [loadPage, offset, pathName]);

  const tableHeaders: HeaderContentProps = useMemo(
    () => [
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
    ],
    []
  );

  const currentPageUrls: RowContentProps[] | ShortUrl[] = useMemo(() => {
    const cardContent = Array.from({ length: limit })
      .map((_, i) => {
        return urls.get(pathName === "/user-urls" ? offset + i : i); // Will change later to make consistent
      })
      .filter((url): url is URLResponse => url !== undefined)
      .map((url) => mapToURL(url));

    const tableContent = Array.from({ length: limit })
      .map((_, i) => {
        return urls.get(pathName === "/user-urls" ? offset + i : i); // Will change later to make consistent
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
    return isMobile ? cardContent : tableContent;
  }, [isMobile, offset, pathName, urls]);

  //Mobile Urls

  console.log({ currentPageUrls, urls });

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * limit;
    if (pathName === "/search") {
      const filterType = pathName.slice(1);
      console.log({ filterType });

      if (filterType === "search" || filterType === "filter") {
        console.log({ newOffset, searchValue });
        applyFilter(
          {
            filters: [
              {
                fields: ["short_code", "long_url"],
                value: searchValue,
                operator: "fulltext",
              },
            ],
            limit,
            offset: newOffset,
          },
          filterType
        );
      }
    }
    setOffset(newOffset);
  };

  const handleSearch = async (value: string) => {
    setOffset(0);
    // setValueForQuery(value);

    applyFilter(
      {
        filters: [
          {
            fields: ["short_code", "long_url"],
            value,
            operator: "fulltext",
          },
        ],
        limit,
        offset: 0,
      },
      "search"
    );
  };

  return (
    <div className="">
      {pathName === "/search" && (
        <div> Search Results for {params.get("filters[0][value]")}</div>
      )}
      <div className=" h-full w-full flex flex-col justify-start items-center pt-[3%]">
        <div className="flex w-[95%] justify-end">
          <SearchInput
            onSearch={handleSearch}
            onChange={setSearchValue}
            value={searchValue}
          />
        </div>
        <TableComponent
          headers={tableHeaders}
          rows={!isMobile ? (currentPageUrls as RowContentProps[]) : []}
          pagination={{
            totalPages,
            currentPage: Math.floor(offset / limit) + 1,
            onPageChangeAction: handlePageChange,
          }}
          isLoading={initializing}
          className="w-[95%] hidden md:block"
        />

        <div className="md:hidden flex flex-col gap-3 w-[90vw] py-2">
          {isMobile &&
            (currentPageUrls as ShortUrl[]).map((u, i) => (
              <URLCard key={i} url={u} actions={<Actions url={u} className="flex-col w-auto justify-between" itemClassName=" w-[24px] aspect-[2/2]"/>} />
            ))}
        </div>
      </div>
    </div>
  );
}
