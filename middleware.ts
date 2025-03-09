import { getAuth } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./firebaseConfig";
import { cookies } from "next/headers";
import { getUser } from "./app/api/users/add";

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

    const uid = req.cookies.get("uid")?.value;
    if (!uid) {
      return NextResponse.redirect("sign-in");
    }

    const user = await getUser(uid, idToken.value);
    const response = NextResponse.next();
    response.headers.set("Authorization", idToken.value);

    // response.headers.set("X-user-data", JSON.stringify(user))
    // console.log("hhhhhhhhhhhhhF")
    // response.headers.set('Access-Control-Expose-Headers', 'X-user-data');
    // console.log("Headers", JSON.stringify(user))

    response.cookies.set("userData", JSON.stringify(user), {
      httpOnly: true, // Allow only server-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });

    // response.cookies.set("userData", JSON.stringify(user), {
    //   httpOnly: false, // Allow client-side access
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/"
    // });

    return response;
    // const decodedClaims = await auth
  } catch (error) {
    console.error("Auth error in middleware:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
// };
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.png|.*\\.gif).*)"],
};
