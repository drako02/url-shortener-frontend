"use client";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";

export const MainHeader = () => {
  const router = useRouter();
  return (
    <div className="header-container w-full h-[100%] flex justify-center items-center ">
      <Menubar
      >
        <MenubarMenu>
          <MenubarTrigger>Home</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Features</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>About</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <Button
        variant="default"
        className=" login_b absolute right-5 bg-black text-white"
        onClick={() => router.push("/sign-in")}
      >
        Login
      </Button>
    </div>
  );
};
