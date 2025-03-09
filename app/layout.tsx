import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainHeader } from "@/mycomponents/headers/header";
import { ThemeProvider } from "../context/Theme";
import { AuthProvider } from "../context/Auth";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserFromCookies } from "./api/users/get";
import { mapToUser } from "./api/helpers";
import { UserProvider } from "@/context/User";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// const cookieStore = await cookies()
// console.log("Cookies on layout: ", cookieStore.getAll())
// const userCookie = getUserFromCookies(cookieStore)
// const user = userCookie ? mapToUser(userCookie) : undefined;

// console.log("User on layout main: ", user)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  console.log("Cookies on layout: ", cookieStore.getAll())
  const userCookie = getUserFromCookies(cookieStore)
  const user = userCookie ? mapToUser(userCookie) : undefined;

  console.log("User on layout main in component: ", user)

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
      >
        <UserProvider initialUser={user}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MainHeader />
              <main className="flex-grow overflow-hidden">{children}</main>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
