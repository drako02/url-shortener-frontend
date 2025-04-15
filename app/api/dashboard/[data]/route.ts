import { NextRequest, NextResponse } from "next/server";
import { getShortUrls } from "../../urls/urls";
import { ANALYTICS_SERVICE_BASE_URL, fetchRequest, mapToURL } from "../../helpers";
import { ClicksResponse } from "../../types";
import { logError } from "../../helpers";
/**
 *
 * param urls, clicks
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { data: "urls" | "clicks" } }
) {
  try {
    const data = (await params).data;
    const uid = request.nextUrl.searchParams.get("uid");

    switch (data) {
      case "urls":
        if (!uid) throw new Error("uid was not provided");
        const userUrlsData = await fetchUserUrls(uid);
        return NextResponse.json({ data: { ...userUrlsData } }, { status: 200 });

      case "clicks":
        if (!uid) throw new Error("uid was not provided");
        const clicksAnalyticsData = await fetchUserClicksAnalytics(uid);
        return NextResponse.json({ data: { ...clicksAnalyticsData } }, { status: 200 });

      default:
        throw new Error(
          `Path parameter not supported. Expected ${typeof params.data}`
        );
    }
  } catch (error) {
    logError({
      context: "Get request for dashboard data in dashboard route",
      error,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get data for dashboard",
      logLevel: "error",
    });

    return NextResponse.json({error: "Request failed"}, {status: 500})
  }
}

const fetchUserUrls = async (uid: string) => {
  const res = await getShortUrls(uid, 0, 0);
  const formattedUrls = res.urls.map(url => mapToURL(url))
  return { totalUrls: res.recordCount, urls: formattedUrls };
};

const fetchUserClicksAnalytics = async (uid: string) => {
  const res = await fetchRequest<ClicksResponse[]>(
    `${ANALYTICS_SERVICE_BASE_URL}/api/analytics/urls/clicks/${uid}`,
    {}
  );
  return { totalClicks: res.length, clicksDetails: res };
};
