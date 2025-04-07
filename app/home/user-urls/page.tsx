"use client";
import { mapToURL } from "@/app/api/helpers";
import { URLResponse } from "@/app/api/types";
import { useUrls } from "@/context/Urls";
import { TableComponent } from "@/mycomponents/table/table";
import {
  BodyCellProps,
  HeaderContentProps,
  RowContentProps,
} from "@/mycomponents/table/types";
import { formatDistance } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function UserUrls() {
  const { urls, updateUrls, allUrlsTotal, initializing } = useUrls();
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  //Pagination
  const totalPages = useMemo(
    () => Math.ceil(allUrlsTotal / limit),
    [allUrlsTotal]
  );
  const handlePageChange = (page: number) => {
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
  ];

  const currentPageUrls: RowContentProps[] = useMemo(() => {
    return Array.from({ length: limit })
      .map((_, i) => {
        return urls.get(offset + i);
      })
      .filter((url): url is URLResponse => url !== undefined)
      .map((url) => mapToURL(url))
      .map((url): BodyCellProps[] => [
        { label: "#" + url.id.toString() },
        { label: url.shortCode },
        { label: url.originalUrl },
        {
          label: formatDistance(new Date(url.createdAt), new Date(), {
            addSuffix: true,
          }),
        },
      ]);
  }, [offset, urls]);

  const fetchUrlsForRequestedPage = useCallback(async () => {
    await updateUrls(limit, offset);
  }, [offset, updateUrls]);

  useEffect(() => {
    const currentPage = Math.floor(offset / limit) + 1;
    if (currentPage > 1) {
      fetchUrlsForRequestedPage();
    }
  }, [fetchUrlsForRequestedPage, offset]);

  return (
    <div className=" h-full w-full flex justify-center items-start">
      <TableComponent
        headers={tableHeaders}
        rows={currentPageUrls}
        pagination={{
          totalPages,
          currentPage: Math.floor(offset / limit) + 1,
          onPageChangeAction: handlePageChange,
        }}
        isLoading={initializing}
      />
    </div>
  );
}
