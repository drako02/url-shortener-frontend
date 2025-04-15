import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed for path:", req.nextUrl.pathname);
  console.log("Cookies:", JSON.stringify(req.cookies.getAll()));
    const cookieStore = await  cookies()

  console.log("COokie store during middleware execution",cookieStore.getAll())


  const url = req.nextUrl.clone();
  const isPublicPath = ["/", "/sign-in", "/sign-up"].includes(url.pathname);
  if (isPublicPath) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value || "";
  console.log("SESSION: ", session)

  if (!session) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get("session");
    if (!idToken) {
      return NextResponse.redirect("/sign-in");
    }
    const response = NextResponse.next();

    return response;
  } catch (error) {
    console.error("Auth error in middleware:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.png|.*\\.gif).*)"],
};
