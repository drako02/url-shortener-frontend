"use client";

import { useState, useMemo, useEffect } from "react";
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

import { URLResponse } from "@/app/api/types";
import {
  URL_SERVICE_API_BASE_URL,
} from "@/app/api/helpers";
import { useUrls } from "@/context/_Urls";
import { useDashboardData } from "./helpers";
import { TableComponent } from "@/mycomponents/table/table";
import { tableHeaders } from "@/lib/constants";
import { urlMapToArray } from "@/lib/helpers";
import { BodyCellProps } from "@/mycomponents/table/types";
import { URLCOMPONENTS } from "@/mycomponents/pages/common/url_table";

export default function Dashboard() {
  // const [links, setLinks] = useState(mockLinks);

  // const { user } = useAuth();
  const { urls: providerUrls , loadPage} = useUrls();
  useEffect(() => {
    loadPage(5, 0);
  }, [loadPage]);

  // const {urls} = useUrls()
  const dashboardTableURls = (
    providerUrls
      ? urlMapToArray(providerUrls as Map<number, URLResponse>, 5)
      : []
  ).map((u): BodyCellProps[] => {
    return [
      { element: URLCOMPONENTS.Id({ id: u.id }) },
      { element: URLCOMPONENTS.ShortUrl({ base: `${URL_SERVICE_API_BASE_URL}`, code: u.shortCode }) },
      { element: URLCOMPONENTS.OriginalUrl({ url: u.originalUrl }) },
      { element: URLCOMPONENTS.CreatedAt({ createdAt: u.createdAt }) },
      { element: URLCOMPONENTS.Clicks({ clicks: u.clicks }) },
      { element: URLCOMPONENTS.Actions({ url: u }) },
    ];
  });

  console.log({providerUrls, dashboardTableURls})

  const { topClicked, totalActiveLinks, totalUrls, totalClicks, last7DaysAnalytics } = useDashboardData();

  return (
    <div className="py-8 mx-3">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Analytics Overview */}
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnalyticCard label={"Total Links"} value={totalUrls} />
        <AnalyticCard label={"Total Clicks"} value={totalClicks} />
        <AnalyticCard label={"Active Links"} value={totalActiveLinks} />
        <AnalyticCard label={"Conversion Rate"} value={null} />
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
      </div>

      <Card>
        <TableComponent headers={tableHeaders} rows={dashboardTableURls}/>
      </Card>
    </div>
  );
}


const AnalyticCard: React.FC<{ label: string; value: number | null }> = ({
  label,
  value,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-bold">{value || "N/A"}</h3>
      </CardContent>
    </Card>
  );
};