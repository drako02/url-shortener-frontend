"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Settings, ShieldCheck, User2 } from "lucide-react";

const SettingsLayout: React.FC<{ children: ReactNode }> = function ({
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Settings
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-8">
                  {settingMenus.map((menu) => (
                    <SettingMenu
                      key={menu.id}
                      id={menu.id}
                      label={menu.label}
                      href={menu.href}
                      icon={menu.icon}
                    />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

type SettingMenuProps = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const settingMenus: SettingMenuProps[] = [
  {
    id: "profile",
    label: "Profile",
    href: "/settings/profile",
    icon: (
      // <svg
      //   className="w-4 h-4"
      //   fill="none"
      //   stroke="currentColor"
      //   viewBox="0 0 24 24"
      // >
      //   <path
      //     strokeLinecap="round"
      //     strokeLinejoin="round"
      //     strokeWidth={2}
      //     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      //   />
      // </svg>
      <User2 className="w-4 h-4"/>
    ),
  },
  {
    id: "account",
    label: "Account",
    href: "/settings/account",
    icon: (
      // <svg
      //   className="w-4 h-4"
      //   fill="none"
      //   stroke="currentColor"
      //   viewBox="0 0 24 24"
      // >
      //   <path
      //     strokeLinecap="round"
      //     strokeLinejoin="round"
      //     strokeWidth={2}
      //     d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      //   />
      //   <path
      //     strokeLinecap="round"
      //     strokeLinejoin="round"
      //     strokeWidth={2}
      //     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      //   />
      // </svg>
      <Settings className="w-4 h-4"/>

    ),
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/settings/privacy",
    icon: (
      // <svg
      //   className="w-4 h-4"
      //   fill="none"
      //   stroke="currentColor"
      //   viewBox="0 0 24 24"
      // >
      //   <path
      //     strokeLinecap="round"
      //     strokeLinejoin="round"
      //     strokeWidth={2}
      //     d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      //   />
      // </svg>
      <ShieldCheck className="w-4 h-4"/>
    ),
  },
];

const SettingMenu: React.FC<SettingMenuProps> = ({ label, href, icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200",
            isActive
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {icon && (
            <span
              className={cn(
                "transition-colors duration-200",
                isActive ? "text-blue-600" : "text-gray-400"
              )}
            >
              {icon}
            </span>
          )}
          <span>{label}</span>
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default SettingsLayout;
