import { NextRequest, NextResponse } from "next/server";
import { UrlQuery, URLResponse } from "../types";
import { fetchRequest, logError, URL_SERVICE_API_BASE_URL } from "../helpers";
import { ApiError } from "next/dist/server/api-utils";
import { auth } from "@/firebaseConfig";

export async function POST(request: NextRequest) {
  try {
    // const token = await auth.currentUser?.getIdToken();
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : "";

    const body = (await request.json()) as UrlQuery;

    const formattedQuery = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value != undefined)
    );
    const res = await fetchRequest(
      `${URL_SERVICE_API_BASE_URL}/urls`,
      {
        method: "POST",
        body: formattedQuery,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    logError({
      context: "Fetching urls with queries",
      error,
      message: "Failed to get urls",
      logLevel: "error",
    });
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ error: "Failed to get urls" }, { status: 500 });
  }
}
