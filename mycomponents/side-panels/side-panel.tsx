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
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SideListOptions {
  name: string;
  icon?: React.ReactElement;
  url?: string;
  onOptionClick?: () => void;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "success"
  };
}

export type SideBarMainProps = {
  title: string;
  logo?: React.ReactNode;
  sideOptions: { title: string; options: SideListOptions[] }[];
  footer?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const SideBarMain = (props: SideBarMainProps) => {
  const { open, setOpen } = useSidebar();
  const { title, logo, sideOptions, footer, onOpenChange } = props;
  const pathname = usePathname();
  
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [open, onOpenChange]);

  // Add responsive handling for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <>
      <Sidebar
        className={cn(
          "bg-card border-r border-border transition-all duration-100 mr-0",
          open ? "w-[200px]" : "w-16"
        )}
        collapsible="icon"
      >
        <div>
          <div className={cn(" flex  w-full ",open?"justify-end": "justify-center")}>
            <SidebarTrigger
              // triggerIcon={
              //   open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
              // }
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
              >
                {/* {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />} */}
              </Button>
            </SidebarTrigger>
          </div>
        </div>
        <main className="flex flex-col justify-between items-center h-full ">
          <div>
            {/* Header area with logo and trigger */}

            <div className="flex  flex-col items-center h-16 px-4 ">
              <div>
                {logo && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-2 flex items-center"
                  >
                    {logo}
                  </motion.div>
                )}

                <motion.div
                  animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
                  className="font-semibold text-xl overflow-hidden whitespace-nowrap"
                >
                  {title}
                </motion.div>
              </div>
            </div>

            <SidebarContent className="pt-4 px-2">
              {/* Sidebar content */}
              {sideOptions.map((item, groupIndex) => (
                <SidebarGroup
                  key={`${item.title}-${groupIndex}`}
                  className="mb-6"
                >
                  {open && (
                    <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {item.title}
                    </SidebarGroupLabel>
                  )}

                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.options.map((option, optionIndex) => {
                        const isActive = option.url && pathname === option.url;

                        return (
                          <TooltipProvider
                            key={`${option.name}-${optionIndex}`}
                            delayDuration={300}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton
                                    onClick={option.onOptionClick}
                                    asChild
                                    className={cn(
                                      "flex items-center px-3 py-2 rounded-md mb-1 group relative",
                                      isActive
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-accent text-foreground hover:text-accent-foreground"
                                    )}
                                  >
                                    <Link
                                      href={option.url || "#"}
                                      className="flex items-center w-full"
                                      onClick={(e) => {
                                        if (!option.onOptionClick) return;
                                        e.preventDefault();
                                        option.onOptionClick();
                                      }}
                                    >
                                      {option.icon && (
                                        <span
                                          className={cn(
                                            "mr-3",
                                            isActive && "text-primary"
                                          )}
                                        >
                                          {option.icon}
                                        </span>
                                      )}

                                      <motion.span
                                        animate={{
                                          opacity: open ? 1 : 0,
                                          width: open ? "auto" : 0,
                                        }}
                                        className="flex-1 overflow-hidden whitespace-nowrap"
                                      >
                                        {option.name}
                                      </motion.span>

                                      {option.badge && open && (
                                        <span
                                          className={cn(
                                            "ml-auto text-xs py-0.5 px-1.5 rounded-full",
                                            option.badge.variant ===
                                              "default" &&
                                              "bg-primary/10 text-primary",
                                            option.badge.variant ===
                                              "secondary" &&
                                              "bg-secondary/10 text-secondary",
                                            option.badge.variant ===
                                              "destructive" &&
                                              "bg-destructive/10 text-destructive",
                                            option.badge.variant ===
                                              "success" &&
                                              "bg-green-500/10 text-green-600"
                                          )}
                                        >
                                          {option.badge.text}
                                        </span>
                                      )}

                                      {isActive && (
                                        <motion.div
                                          layoutId="active-indicator"
                                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.2 }}
                                        />
                                      )}
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </TooltipTrigger>
                              {!open && (
                                <TooltipContent side="right">
                                  {option.name}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </div>

          {footer && (
            <div
              className={cn(
                "border-t border-border p-4 mt-auto",
                !open && "flex justify-center"
              )}
            >
              {footer}
            </div>
          )}
        </main>
      </Sidebar>
    </>
  );
};

export const AppSidebar = (props: SideBarMainProps) => {
  return (
    <div className="h-full">
      <SidebarProvider defaultOpen>
        <SideBarMain {...props} />
      </SidebarProvider>
    </div>
  );
};
