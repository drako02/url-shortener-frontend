import { adminAuth } from "@/firebaseAdminConfig";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const idToken = request.nextUrl.searchParams.get("idToken");
    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return NextResponse.json(decodedToken, { status: 200 });
  } catch (error) {
    logError({
      error,
      logLevel: "error",
      context: "Decoding idTOken in api route",
      message: "Unknown error",
    });
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
