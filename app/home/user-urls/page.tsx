"use client";

import { BASE_API_URL } from "@/app/api/helpers";
import { getShortUrls } from "@/app/api/urls/urls";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/Auth";
import { TableLoader } from "@/mycomponents/loaders/table";
import React, { use, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UserUrlsPage = () => {
  const [urls, setUrls] = useState<
    {
      id: number;
      short_code: string;
      long_url: string;
      created_at: Date;
      updated_at: Date;
      user_id: number;
    }[]
  >([]);
  const [offset, setOffset] =useState<number>(0)
  const [loading, setLoading] = useState(true);
  const limit = 10

  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid) {
      getShortUrls(user?.uid as string, limit, offset)
        .then((res) => setUrls(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user?.uid, offset]);

  const handleOffset = (dir: "next" | "previous") => {
    if (dir === "next") {
      setOffset(offset + limit);
    } else {
      setOffset(Math.max(0, offset - limit));
    }
  };

  if (loading) return <TableLoader />;

  const tableHeaderList = ["ID", "Short Url", "Long Url", "Created At"];

  if (!urls.length) {
    return <div>YOu have no short urls yet</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">My URLs</h1>
      {/* <div className="space-y-4"> */}
      {/* {urls.map((url, index) => (
          <div key={url.id} className="flex gap-7">
            <p> {index + 1} </p>
            <p> {`${BASE_API_URL}/${url.short_code}`}</p>
            <p> {url.long_url}</p>
            <p>{url.created_at.toLocaleString()}</p>
          </div>
        ))} */}
      <Table>
        <TableCaption>Your shortened urls</TableCaption>
        <TableHeader>
          <TableRow>
            {tableHeaderList.map((item, index) => (
              // <TableRow>
              <TableHead key={index}> {item}</TableHead>
              // </TableRow>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url, index) => (
            <TableRow key={url.id}>
              <TableCell>{`#${url.id}`}</TableCell>
              <TableCell>
                <a
                  href={`${BASE_API_URL}/${url.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >{`${BASE_API_URL}/${url.short_code}`}</a>
              </TableCell>
              <TableCell>
                <a
                  href={url.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.long_url}
                </a>
              </TableCell>
              <TableCell>
                {" "}
                {new Date(url.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="">
          <TableRow>
            <TableCell colSpan={4} className="text-center p-0">
              <Pagination className="flex w-full">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handleOffset("previous")} href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handleOffset("next")}href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {/* </div> */}
    </div>
  );
};

export default UserUrlsPage;
