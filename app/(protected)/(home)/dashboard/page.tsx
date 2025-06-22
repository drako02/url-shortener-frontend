"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Copy,
  Trash2,
  Edit2,
  BarChart2,
  Link,
  Search,
  RefreshCw,
  Plus,
} from "lucide-react";
import { URLResponse } from "@/app/api/types";
import { format } from "date-fns";
import {
  mapToURL,
  URL_SERVICE_API_BASE_URL,
} from "@/app/api/helpers";
import { useUrls } from "@/context/_Urls";
import { useDashboardData } from "./helpers";

export default function Dashboard() {
  // const [links, setLinks] = useState(mockLinks);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const { user } = useAuth();
  const { urls: providerUrls } = useUrls();
  const urls = useMemo(
    // () => providerUrls.map((url) => mapToURL(url)).slice(0, 5),
    () =>
      Array.from({ length: 5 })
        .map((_, i) => providerUrls?.get(i))
        .filter((url): url is URLResponse => url !== undefined)
        .map((url) => mapToURL(url)),
    [providerUrls]
  );

  const { topClicked, totalActiveLinks, totalUrls, totalClicks, last7DaysAnalytics } = useDashboardData();

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(`${URL_SERVICE_API_BASE_URL}/${shortUrl}`);
    // Add toast notification here
  };

  const handleDeleteLink = (id: number) => {

  };

  const filteredUrls = urls.filter(
    (url) =>
      url.shortCode.includes(searchTerm) || url.originalUrl.includes(searchTerm)
  );

  return (
    <div className="py-8 mx-3">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Quick URL shortener section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Create New Short URL</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Link className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                className="pl-10"
                placeholder="Paste your long URL here"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {}}
              disabled={!urlInput.trim() || isLoading}
              className="whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Creating..." : "Shorten URL"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Links</p>
            <h3 className="text-3xl font-bold">{totalUrls}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <h3 className="text-3xl font-bold">{totalClicks}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Links</p>
            <h3 className="text-3xl font-bold">{totalActiveLinks}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <h3 className="text-3xl font-bold">{"N/A"}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Click Analytics Chart */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Click Analytics (Last 7 days)
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* URL Management */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Your URLs</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              className="pl-10 w-full sm:w-64"
              placeholder="Search URLs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead>Created</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUrls.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No URLs found. Create your first short URL above.
                </TableCell>
              </TableRow>
            ) : (
              filteredUrls.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{link.shortCode}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <BarChart2 className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>{"N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(link.createdAt, "PP")}</TableCell>
                  {/* <TableCell>
                    <Badge
                      variant={
                        link.status === "active" ? "success" : "secondary"
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex justify-end gap-1">
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopyLink(link.shortCode)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy URL</TooltipContent>
                        </UITooltip>

                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </UITooltip>

                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteLink(link.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </UITooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
