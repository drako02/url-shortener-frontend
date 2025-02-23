"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { Button } from "./components/buttons/button";

export default function Home() {
  const router = useRouter()
  const handleCTA = () => {
    // router.push("/(auth)/sign-in")
  }
  return (
    <div className="absolute left-[50%] top-[50%] flex flex-col justify-center items-center h-[60%] w-[68%] translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-[48px] w-[16em] text-center leading-[60px] font-bold">
        Make your links shorter, smarter, and more powerful.
      </h1>
      <p className="text-[24px] mt-[8px]">
        🔗 Instantly shorten long URLs to make them easy to share.
      </p>
      <p>Start shortening now—it's fast, free, and effortless!</p>
      <Button onClick={handleCTA} className="mt-[4%] bg-black text-white"> Get started </Button>
    </div>
  );
}
