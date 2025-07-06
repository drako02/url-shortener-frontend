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
                <NavigationMenuList className="flex space-x-5">
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
      <User2 className="w-4 h-4"/>
    ),
  },
  {
    id: "account",
    label: "Account",
    href: "/settings/account",
    icon: (
      <Settings className="w-4 h-4"/>

    ),
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/settings/privacy",
    icon: (
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
            "flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors duration-200",
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
