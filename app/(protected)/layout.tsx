import { adminAuth } from "@/firebaseAdminConfig";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSessionCookies } from "../actions/manageCookies";

// This is a server component
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session cookie
  const session = (await cookies()).get("session")?.value;
  console.log("protected layout session: ", session)
  
  if (!session) {
    redirect("/sign-in");
  }
  
  try {
    // Verify session using Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(session);
    
    // Optional: You can check if token is expired or too old
    const tokenAge = Date.now() - decodedToken.auth_time * 1000;
    if (tokenAge > 60 * 60 * 24 * 1000) { // 24 hours
      // Force refresh if token is too old
      // (await cookies()).delete("session");
      await deleteSessionCookies()
      redirect("/sign-in");
    }
    
    // User is authenticated, render children
    return <>{children}</>;
  } catch (error) {
    console.error("Invalid session:", error);
    await deleteSessionCookies()
    redirect("/sign-in");
  }
}