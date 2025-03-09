"use client";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isSignUp = pathName === "/sign-up";

  return (
    <div className="flex  h-full">
      <div
        className={`${
          isSignUp ? "bg-signup-image" : "bg-signin-image"
        } relative bg-cover bg-center w-[75%] bg-black rounded-r-xl`}
      >
        <div className="absolute inset-0 bg-gradient-to-r  from-transparent  to-black/30 rounded-r-xl"></div>
      </div>
      <div className=" w-1/2 flex justify-center items-center">{children}</div>
    </div>
  );
}
