"use client";

import { useState, useEffect, useMemo, useCallback, useReducer } from "react";
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
import { useAuth } from "@/context/Auth";
import { ClicksResponse, URLResponse } from "@/app/api/types";
import { format } from "date-fns";
import {
  APIResponse,
  fetchRequest,
  mapToURL,
  URL_SERVICE_API_BASE_URL,
} from "@/app/api/helpers";
import { useUrls } from "@/context/_Urls";
import { auth } from "@/firebaseConfig";
import { getShortUrls } from "@/app/api/urls/urls";
import { toast } from "sonner";
// import { useUrls } from "@/context/Urls";

// Mock data - replace with actual API calls
// const mockAnalytics = {
//   totalLinks: 158,
//   totalClicks: 3427,
//   activeLinks: 142,
//   conversionRate: "4.8%",
// };

type Analytics = {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  conversionRate: number;
};

const getChartData = (clicks: ClicksResponse[]) => {
  const clicksByDay = clicks.reduce((acc, click) => {
    const day = format(new Date(click.timestamp), "eee");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatted = Object.entries(clicksByDay).map(([name, clicks]) => ({
    name,
    clicks,
  }));
  return formatted;
  // const formatted = clicks.map( click => formatD new Date(click.timestamp))
};

const mockLinks = [
  {
    id: 1,
    shortUrl: "abc123",
    originalUrl: "https://example.com/very-long-url-1",
    clicks: 145,
    createdAt: "2025-03-28",
    status: "active",
  },
  {
    id: 2,
    shortUrl: "def456",
    originalUrl: "https://example.com/very-long-url-2",
    clicks: 89,
    createdAt: "2025-03-27",
    status: "active",
  },
  {
    id: 3,
    shortUrl: "ghi789",
    originalUrl: "https://example.com/very-long-url-3",
    clicks: 56,
    createdAt: "2025-03-26",
    status: "inactive",
  },
  {
    id: 4,
    shortUrl: "jkl012",
    originalUrl: "https://example.com/very-long-url-4",
    clicks: 234,
    createdAt: "2025-03-25",
    status: "active",
  },
];

export default function Dashboard() {
  const [links, setLinks] = useState(mockLinks);
  // const [urls, setUrls] = useState<ShortUrl[]>([]);
  // const [analytics, setAnalytics] = useState<Analytics>({
  //   totalLinks: 0,
  //   totalClicks: 0,
  //   activeLinks: 0,
  //   conversionRate: 0,
  // });
  const [chartData, setChartData] = useState<
    {
      name: string;
      clicks: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
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

  const { topClicked, totalActiveLinks, totalUrls, totalClicks } = useDashboardData();

  // useEffect(() => {
  //   if (user) {
  //     // getTopClicked();
  //     // getTotalURLs();
  //     getTotalActiveUrls();
  //   }
  // }, [ getTotalActiveUrls, getTotalURLs, user]);

  // useEffect(() => {
  //   const fetchClicksData = async () => {
  //     const res = await fetch(`/api/dashboard/clicks?uid=${user?.uid}`);
  //     if (!res.ok) return;
  //     const { data } = (await res.json()) as {
  //       data: { totalClicks: number; clicksDetails: ClicksResponse[] };
  //     };
  //     setAnalytics((prevState) => ({
  //       ...prevState,
  //       totalClicks: data.totalClicks,
  //     }));
  //     console.log("Dashboard data: ", data);

  //     const chartData = getChartData(data.clicksDetails);
  //     console.log("CHART DATA: ", chartData);
  //     setChartData(chartData);
  //   };
  //   fetchClicksData();
  // }, [user?.uid]);

  const handleCreateShortUrl = () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    // In a real app: call API to create short URL
    setTimeout(() => {
      // Mock response
      const newLink = {
        id: links.length + 1,
        shortUrl: `new${Math.floor(Math.random() * 1000)}`,
        originalUrl: urlInput,
        clicks: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };

      setLinks([newLink, ...links]);
      setUrlInput("");
      setIsLoading(false);
    }, 500);
  };

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(`${URL_SERVICE_API_BASE_URL}/${shortUrl}`);
    // Add toast notification here
  };

  const handleDeleteLink = (id: number) => {
    // In a real app: call API to delete
    setLinks(links.filter((link) => link.id !== id));
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
              onClick={handleCreateShortUrl}
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
              <BarChart data={chartData}>
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

type ShortcodeAndClicks = {
  shortcode: string;
  clicks: number;
};

const useDashboardData = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const { user } = useAuth();

  const getTotalURLs = useCallback(async () => {
    if (!user) return;
    try {
      dispatch({ type: "GET_TOTAL_URLS_START" });
      const result = await getShortUrls(user?.uid, 0, 0);
      dispatch({ type: "GET_TOTAL_URLS_SUCCESS", payload: result.recordCount });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch URLs total";
      dispatch({ type: "GET_TOTAL_URLS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user]);

  const getTopClicked = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOP_CLICKED_START" });
      const res = await fetchRequest<
        APIResponse<{ shortCode: string; totalClicks: number }[]>
      >(`/api/dashboard/topclicked?userId=${user?.id}&limit=5`, {});
      const payload =
        res.data?.map((i) => ({
          shortcode: i.shortCode,
          clicks: i.totalClicks,
        })) || [];
      dispatch({ type: "GET_TOP_CLICKED_SUCCESS", payload });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch top clicked URLs";
      dispatch({ type: "GET_TOP_CLICKED_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.id]);

  const getTotalActiveUrls = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOTAL_ACTIVE_URLS_START" });
      const idToken = await auth.currentUser?.getIdToken();
      const res = (await fetchRequest(
        `/api/dashboard/active?uid=${user?.uid}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      )) as APIResponse<{ length: number }>;
      if (!res.success || !res.data) {
        toast.error("Could not get active URLs");
        console.error(res.errors);
        return;
      }
      console.log("Active Urls length: ", res.data.length);
      dispatch({
        type: "GET_TOTAL_ACTIVE_URLS_SUCCESS",
        payload: res.data.length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch total active URLs";
      dispatch({ type: "GET_TOTAL_ACTIVE_URLS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.uid]);

  const getTotalClicks = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOTAL_CLICKS_START" });
      const res = await fetchRequest<APIResponse<{ totalClicks: number }>>(
        `/api/dashboard/clicks?userId=${user?.id}`,
        {}
      );
      if (res.success && res.data) {
        dispatch({ type: "GET_TOTAL_CLICKS_SUCCESS", payload: res.data.totalClicks });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch total clicks";
      dispatch({ type: "GET_TOTAL_CLICKS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    const getAnalytics = async () => {
      await Promise.all([
        getTotalURLs(),
        getTotalActiveUrls(),
        getTopClicked(),
        getTotalClicks()
      ]);
    };
    getAnalytics();
  }, [getTopClicked, getTotalActiveUrls, getTotalClicks, getTotalURLs]);

  return {
    getTopClicked,
    getTotalURLs,
    getTotalActiveUrls,
    totalActiveLinks: state.totalActiveUrls.data,
    totalClicks: state.totalClicks.data,
    totalUrls: state.totalUrls.data,
    topClicked: state.topClicked.data,
    loading: {
      totalUrls: state.totalUrls.loading,
      totalActiveUrls: state.totalActiveUrls.loading,
      topClicked: state.topClicked.loading,
      totalClicks: state.totalClicks.loading 
    },
    errors: {
      totalUrls: state.totalUrls.error,
      totalActiveUrls: state.totalActiveUrls.error,
      topClicked: state.topClicked.error,
      totalClicks: state.totalClicks.error 
    },
  };
};

// const actions = {
//   GET_TOTAL_URLS: "GET_TOTAL_URLS",
//   GET_TOTAL_ACTIVE_URLS: "GET_TOTAL_ACTIVE_URLS",
//   GET_TOP_CLICKED: "GET_TOP_CLICKED",
// } as const;

type DashboardAction =
  | { type: "GET_TOTAL_URLS_START" }
  | { type: "GET_TOTAL_URLS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_URLS_ERROR"; payload: string }
  | { type: "GET_TOTAL_ACTIVE_URLS_START" }
  | { type: "GET_TOTAL_ACTIVE_URLS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_ACTIVE_URLS_ERROR"; payload: string }
  | { type: "GET_TOP_CLICKED_START" }
  | { type: "GET_TOP_CLICKED_SUCCESS"; payload: ShortcodeAndClicks[] }
  | { type: "GET_TOP_CLICKED_ERROR"; payload: string }
  | { type: "GET_TOTAL_CLICKS_START" }
  | { type: "GET_TOTAL_CLICKS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_CLICKS_ERROR"; payload: string };

type DashboardState = {
  totalUrls: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
  totalActiveUrls: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
  topClicked: {
    data: ShortcodeAndClicks[] | null;
    loading: boolean;
    error: string | null;
  };
  totalClicks: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
};

const initialDashboardState: DashboardState = {
  totalUrls: { data: null, loading: false, error: null },
  totalActiveUrls: { data: null, loading: false, error: null },
  topClicked: { data: null, loading: false, error: null },
  totalClicks: { data: null, loading: false, error: null },
};

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case "GET_TOTAL_URLS_START":
      return {
        ...state,
        totalUrls: { ...state.totalUrls, loading: true, error: null },
      };
    case "GET_TOTAL_URLS_SUCCESS":
      return {
        ...state,
        totalUrls: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_URLS_ERROR":
      return {
        ...state,
        totalUrls: {
          ...state.totalUrls,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOTAL_ACTIVE_URLS_START":
      return {
        ...state,
        totalActiveUrls: {
          ...state.totalActiveUrls,
          loading: true,
          error: null,
        },
      };
    case "GET_TOTAL_ACTIVE_URLS_SUCCESS":
      return {
        ...state,
        totalActiveUrls: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_ACTIVE_URLS_ERROR":
      return {
        ...state,
        totalActiveUrls: {
          ...state.totalActiveUrls,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOP_CLICKED_START":
      return {
        ...state,
        topClicked: { ...state.topClicked, loading: true, error: null },
      };
    case "GET_TOP_CLICKED_SUCCESS":
      return {
        ...state,
        topClicked: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOP_CLICKED_ERROR":
      return {
        ...state,
        topClicked: {
          ...state.topClicked,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOTAL_CLICKS_START":
      return {
        ...state,
        totalClicks: {
          ...state.totalClicks,
          loading: true,
          error: null,
        },
      };
    case "GET_TOTAL_CLICKS_SUCCESS":
      return {
        ...state,
        totalClicks: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_CLICKS_ERROR":
      return {
        ...state,
        totalClicks: {
          ...state.totalClicks,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};
