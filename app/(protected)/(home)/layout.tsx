"use client";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/mycomponents/loaders/loading";
import {
  AppSidebar,
  SideListOptions,
} from "@/mycomponents/side-panels/side-panel";
import {
  Home,
  Link,
  PlusCircle,
  Settings,
  User,
  ArrowLeftSquare,
} from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useAuth();
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    // window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const { user, initializing } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log("Auth condition user: ", user);
  }, [initializing, router, user]);

  if (initializing) return <LoadingScreen />;

  if (!initializing && !user) {
    return <LoadingScreen />; // Show loading during redirect
  }

  const sideBarOptions: { title: string; options: SideListOptions[] }[] = [
    {
      title: "Main",
      options: [
        {
          name: "Dashboard",
          icon: <Home size={18} />,
          url: "/dashboard",
        },
        {
          name: "My URLs",
          icon: <Link size={18} />,
          url: "/user-urls",
        },
        {
          name: "Create URL",
          icon: <PlusCircle size={18} />,
          url: "/create",
        },
      ],
    },
    {
      title: "Account",
      options: [
        {
          name: "Profile",
          icon: <User size={18} />,
        },
        {
          name: "Settings",
          icon: <Settings size={18} />,
        },
        {
          name: "Sign out",
          icon: <ArrowLeftSquare size={18} />,
          onOptionClick: () => {
            signOut();
            router.push("/sign-in");
          },
        },
      ],
    },
  ];

  return (
    <div className="flex w-full h-full">
      <div className="flex h-screen">
        <AppSidebar title="URL Shortener" sideOptions={sideBarOptions} />
      </div>

      <div className=" home-layout h-full w-full flex">{children}</div>
    </div>
  );
}
