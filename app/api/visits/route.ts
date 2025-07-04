import { NextRequest, NextResponse } from "next/server";
import { ANALYTICS_SERVICE_BASE_URL } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const shortcode = request.nextUrl.searchParams.get("shortcode");
    const res = await fetch(
      `${ANALYTICS_SERVICE_BASE_URL}/api/analytics/urls/${shortcode}/clicks`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error fetching url visits" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error, message: "Failed to fetch url vistit count" },
      { status: 500 }
    );
  }
}
