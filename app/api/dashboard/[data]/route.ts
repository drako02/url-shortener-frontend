import { NextRequest, NextResponse } from "next/server";
import { getShortUrls } from "../../urls/urls";
import {
  ANALYTICS_SERVICE_BASE_URL,
  APIError,
  APIResponse,
  fetchRequest,
  mapToURL,
  URL_SERVICE_API_BASE_URL,
} from "../../helpers";
import { ClicksResponse } from "../../types";
import { logError } from "../../helpers";
import { FilterProps } from "@/app/types";
/**
 *
 * param urls, clicks
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      data:
        | "urls"
        | "clicks"
        | "topclicked"
        | "active"
        | "getClicks"
        | "urlClicks";
    };
  }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const data = (await params).data;
    const userId = request.nextUrl.searchParams.get("userId");
    // if (!userId && data !== "active") {
    //   return NextResponse.json<APIResponse<null>>(
    //     {
    //       success: false,
    //       errors: {
    //         "Invalid Request": ["userId was not defined in query params"],
    //       },
    //     },
    //     { status: 400 }
    //   );
    // }

    const topClickedLimit = request.nextUrl.searchParams.get("limit");

    console.log("dataaaa: ", data);
    switch (data) {
      case "urls":
        if (!userId) {
          return NextResponse.json<APIResponse<null>>(
            {
              success: false,
              errors: {
                "Invalid Request": ["userId was not defined in query params"],
              },
            },
            { status: 400 }
          );
        }

        const userUrlsData = await fetchUserUrls(userId);
        return NextResponse.json<APIResponse<unknown>>(
          {
            data: { ...userUrlsData },
            success: true,
          },
          { status: 200 }
        );

      case "clicks":
        if (!userId) {
          throw new APIError({
            message: "userId was not defined in query params",
            method: "GET",
            url: request.nextUrl.toString(),
            status: 400,
          });
        }

        const clicksAnalyticsData = await fetchUserTotalClicks(userId);
        return NextResponse.json<APIResponse<unknown>>(
          {
            data: { ...clicksAnalyticsData },
            success: true,
          },
          { status: 200 }
        );

      case "topclicked":
        if (!userId) {
          throw new APIError({
            message: "userId was not defined in query params",
            method: "GET",
            url: request.nextUrl.toString(),
            status: 400,
          });
        }

        if (!topClickedLimit || isNaN(Number(topClickedLimit))) {
          // throw new Error("limit are required for topclicked query");
          throw new APIError({
            message: "Invalid limit for topCLicked query",
            method: "GET",
            url: request.nextUrl.toString(),
            status: 400,
          });
        }
        console.log("uidddd:", userId);
        const res = await fetchTopNURLClicks(
          Number(userId),
          Number(topClickedLimit)
        );
        return NextResponse.json({ data: res });

      case "active":
        if (!authHeader) {
          return NextResponse.json<APIResponse<null>>(
            {
              success: false,
              errors: { auth: ["Missing Authorization header"] },
            },
            { status: 401 }
          );
        }

        const queryProps: FilterProps = {
          filters: [{ field: "active", operator: "eq", value: true }],
        };
        const uid = request.nextUrl.searchParams.get("uid");
        if (!uid)
          return NextResponse.json<APIResponse<null>>(
            {
              success: false,
              errors: { "Invalid Request": ["uid was not provided"] },
            },
            { status: 400 }
          );

        // const URLQuery = buildFilterQuery(queryProps);
        const { length: activeURLsLength } = await fetchRequest<{
          urls: unknown;
          length: number;
        }>(`${URL_SERVICE_API_BASE_URL}/urls`, {
          headers: { Authorization: authHeader },
          method: "POST",
          body: {
            ...queryProps,
            uid,
          },
        });

        return NextResponse.json<APIResponse<{ length: number }>>({
          data: { length: activeURLsLength },
          success: true,
        });

      case "getClicks": {
        const { start, end } = Object.fromEntries(
          request.nextUrl.searchParams.entries()
        );
        console.log({ start, end });

        const res = await fetchRequest<ClicksResponse[]>(
          `${ANALYTICS_SERVICE_BASE_URL}/api/analytics/urls/clicks/${userId}?startDate=${start}&endDate=${end}`,
          {}
        );
        return NextResponse.json<APIResponse<ClicksResponse[]>>(
          {
            success: true,
            data: res,
          },
          { status: 200 }
        );
      }

      // case "urlClicks": {
      //   const shortcode = request.nextUrl.searchParams.get("shortcode")
      //   if (!shortcode){
      //     throw "" // Handle properly
      //   }

      //   const res = await fetchRequest()
      // }
      default:
        // throw new Error(
        //   `Path parameter not supported. Expected ${typeof params.data}`
        // );
        throw new APIError({
          message: `Path parameter not supported`,
          method: "GET",
          url: request.nextUrl.toString(),
          status: 400,
        });
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
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

const fetchUserUrls = async (uid: string) => {
  const res = await getShortUrls(uid, 0, 0);
  const formattedUrls = res.urls.map((url) => mapToURL(url));
  return { totalUrls: res.recordCount, urls: formattedUrls };
};

const fetchUserTotalClicks = async (uid: string) => {
  const res = await fetchRequest<ClicksResponse[]>(
    `${ANALYTICS_SERVICE_BASE_URL}/api/analytics/urls/clicks/${uid}`,
    {}
  );
  return { totalClicks: res.length, clicksDetails: res };
};

const fetchTopNURLClicks = async (userId: number, limit: number) => {
  const res = await fetchRequest(
    `${ANALYTICS_SERVICE_BASE_URL}/api/analytics/users/${userId}/shortcodes/top?limit=${limit}`,
    {}
  );
  console.log("SHORTCODE WITH CLICKS: ", res);
  return res;
};
