"use client";
import { useAuth } from "@/app/context/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {Loading} from "../../mycomponents/Loading/loading";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authenticating } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    if (!user && !authenticating) {
      router.push("/sign-in");
    } else {
      setLoading(false)
    }
  }, [user, router, authenticating]);

  if(loading) return <Loading/>
  return <>{children}</>;
}
