"use client";
import { useAuth } from "@/app/context/Auth";
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
import { useRouter, usePathname } from "next/navigation";

const pathToShowSignIn = "/";
const pathToShowNothing = ["/sign-in", "/sign-up"];

export const MainHeader = () => {
  const pathName = usePathname();
  const showSignIn = pathName === pathToShowSignIn;
  const showNothing = pathToShowNothing.includes(pathName);
  const router = useRouter();
  const { signOut } = useAuth();
  return (
    <div className="header-container w-full h-[100%] flex justify-center items-center ">
      <Menubar>
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
      {showSignIn ? (
        <Button
          variant="default"
          className=" login_b absolute right-5 bg-black text-white"
          onClick={() => router.push("/sign-in")}
        >
          Sign in
        </Button>
      ) : showNothing ? (
        <></>
      ) : (
        <Button
          variant="default"
          className=" login_b absolute right-5 bg-black text-white"
          onClick={() => {
            signOut()
            router.push("/sign-in")
          }}
        >
          {" "}
          Sign out
        </Button>
      )}
    </div>
  );
};
