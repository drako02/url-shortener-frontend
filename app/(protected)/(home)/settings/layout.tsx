import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React, { ReactNode } from "react";

const SettingsLayout: React.FC<{ children: ReactNode }> = function ({
  children,
}) {
  return (
    <>
      <div className=" header pt-8 border-b-[0.5px] ">
        <div className="mx-6">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <div className="ml-2">
            <NavigationMenu className="border-b-[0.5px]">
              <NavigationMenuList className="gap-3">
                {settingMenus.map((menu, i) => (
                  <SettingMenu
                    key={i}
                    id={menu.id}
                    label={menu.label}
                    href={menu.href}
                  />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <div>{children}</div>
      </div>
    </>
  );
};

type SettingMenuProps = {
  id: string;
  label: string;
  href: string;
};
const settingMenus: SettingMenuProps[] = [
  { id: "profile", label: "Profile", href: "/settings/profile" },
  { id: "account", label: "Account", href: "/settings/account" },
  { id: "privacy", label: "Privacy", href: "/settings/privacy" },
];

const SettingMenu: React.FC<SettingMenuProps> = ({ label, href }) => {
  return (
    <NavigationMenuItem className="text-sm font-medium text-gray-600 border-b-[1px] border-transparent hover:border-black px-1">
      <NavigationMenuLink asChild>
        <Link href={href}>{label}</Link>
      </NavigationMenuLink>
      {/* <NavigationMenuTrigger>{label}</NavigationMenuTrigger> */}
    </NavigationMenuItem>
  );
};

export default SettingsLayout;
