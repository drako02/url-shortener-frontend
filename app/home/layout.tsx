"use client";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/mycomponents/loaders/loading";
import { AppSidebar, SideListOptions } from "@/mycomponents/side-panels/side-panel";
import { Home, Link, PlusCircle, Settings, User } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initializing } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user && !initializing) {
      router.push("/sign-in");
    }
  }, [initializing, router, user]);

  if (initializing) return <LoadingScreen />;

  if (!user) return <LoadingScreen />;

  const sideBarOptions: { title: string; options: SideListOptions[] }[] = [
    {
        title: "Main",
        options: [
            {
                name: "Dashboard",
                icon: <Home size={18} />,
                // active: true
            },
            {
                name: "My URLs",
                icon: <Link size={18} />
            },
            {
                name: "Create URL",
                icon: <PlusCircle size={18} />,
                url: "/home/create"
            },
        ]
    },
    {
        title: "Account",
        options: [
            {
                name: "Profile",
                icon: <User size={18} />
            },
            {
                name: "Settings",
                icon: <Settings size={18} />
            },
        ]
    }
]


  return (
    <div className="h-full w-full flex ">
      {" "}
      <AppSidebar title="URL Shortener" sideOptions={sideBarOptions} />
      {children}
    </div>
  );
}
