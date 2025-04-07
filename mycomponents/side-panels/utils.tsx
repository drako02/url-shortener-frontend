import { Home, Link, PlusCircle, Settings, User } from "lucide-react";
import { SideListOptions } from "./side-panel";

export const sideBarOptions: { title: string; options: SideListOptions[] }[] = [
    {
      title: "Main",
      options: [
        {
          name: "Dashboard",
          icon: <Home size={18} />,
        },
        {
          name: "My URLs",
          icon: <Link size={18} />,
          url: "/home/user-urls",
        },
        {
          name: "Create URL",
          icon: <PlusCircle size={18} />,
          url: "/home/create",
        },
      ],
    },
    {
      title: "Account",
      options: [
        {
          name: "Profile",
          icon: <User size={18} />,
        },
        {
          name: "Settings",
          icon: <Settings size={18} />,
        },
      ],
    },
  ];