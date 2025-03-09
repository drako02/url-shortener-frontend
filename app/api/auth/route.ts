import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!req.body) {
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 400 }
    );
  }
  try {
    const body = await req.json();
    const { idToken, uid } = body;

    if (!idToken || !uid) {
      return NextResponse.json(
        { error: "IdToken is required" },
        { status: 400 }
      );
    }
    console.log("Received idToken:", idToken);

    const cookieStore = await cookies();
    cookieStore.set("session", idToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookieStore.set("uid", uid, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("userData");

    cookieStore.delete("uid");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove cookies: ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
