import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";

export interface SideListOptions {
  name: string;
  icon?: React.ReactElement;
  url?: string;
  onOptionClick?: () => void;
}

type SideBarMainProps = {
  title: string;
  sideOptions: { title: string; options: SideListOptions[] }[];
};
const SideBarMain = (props: SideBarMainProps) => {
  const { open } = useSidebar();
  const { title, sideOptions } = props;
  return (
    <>
      <Sidebar className="bg-transparent" collapsible="icon">
        <main>
          <SidebarTrigger />
        </main>

        <SidebarContent>
          <p className="font-semibold text-[24px] pt-[15px] pl-[10px]">
            {open ? title : ""}
          </p>
          {sideOptions.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.options.map((option) => (
                    <SidebarMenuItem key={option.name}>
                      <SidebarMenuButton asChild>
                        <a href={option.url || "#"}>
                          {option.icon}
                          <span>{option.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export const AppSidebar = (props: SideBarMainProps) => {
  return (
    <div className="flex flex-col justify-start  h-full">
      <SidebarProvider className="">
        <SideBarMain {...props} />
      </SidebarProvider>
    </div>
  );
};
