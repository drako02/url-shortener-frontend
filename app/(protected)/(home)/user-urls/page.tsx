"use client";
import { mapToURL, URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { ShortUrl, URLResponse } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { useUrls } from "@/context/Urls";
import { TableComponent } from "@/mycomponents/table/table";
import {
  BodyCellProps,
  HeaderContentProps,
  RowContentProps,
} from "@/mycomponents/table/types";
import { format, formatDistance } from "date-fns";
import {
  Copy,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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

  const currentPageUrls: RowContentProps[] = useMemo(() => {
    return Array.from({ length: limit })
      .map((_, i) => {
        return urls.get(offset + i);
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
              <Link href={`${URL_SERVICE_API_BASE_URL}/${url.shortCode}`} className="flex gap-1 items-center">
                {" "}<LinkIcon size="12"/>
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

  // const fetchUrlsForRequestedPage = useCallback(async () => {
  //   await updateUrls(limit, offset);
  // }, [offset, updateUrls]);

  useEffect(() => {
    const currentPage = Math.floor(offset / limit) + 1;
    if (currentPage > 1) {
      const fetchUrlsForRequestedPage = async () => {
        await updateUrls(limit, offset);
      };
      fetchUrlsForRequestedPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

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
