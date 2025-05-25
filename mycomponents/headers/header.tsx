"use client";

import * as React from "react";
import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LinkIcon,
  Menu,
  User,
  LogOut,
  ChevronDown,
  Home,
  Info,
  Zap,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const protectedRoutes = ["/home", "/user-urls"];
const excludeRoutes = ["/sign-in", "/sign-up"];

interface MainHeaderProps {
  useDefaultLinks?: boolean;
  navs?: { name: string; href: string; icon?: React.ReactElement }[];
  className?: string;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  useDefaultLinks = true,
  navs,
  className,
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Detect scroll position for header styling
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showAuthButton = !excludeRoutes.includes(pathName);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathName?.startsWith(route)
  );
  const isActive = (path: string) => pathName === path;

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Skip rendering header on auth pages
  if (excludeRoutes.includes(pathName || "")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky z-50 top-0 w-full border-b bg-background/95 backdrop-blur transition-all duration-300",
        scrolled ? "shadow-sm" : "",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight group-hover:text-primary transition-colors">
              UrlShortener
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-all duration-200 hover:bg-accent/80",
                      isActive("/") &&
                        "font-medium text-primary bg-primary/10 hover:bg-primary/15"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {isProtectedRoute && (
                <NavigationMenuItem>
                  <Link href="/user-urls" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "transition-all duration-200 hover:bg-accent/80",
                        isActive("/user-urls") &&
                          "font-medium text-primary bg-primary/10 hover:bg-primary/15"
                      )}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      My URLs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <NavigationMenuTrigger className="group">
                  <Zap className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-primary transition-colors">
                    Features
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem
                      title="URL Shortening"
                      href="#"
                      icon={<LinkIcon className="h-4 w-4" />}
                    >
                      Create compact, shareable links in seconds
                    </ListItem>
                    <ListItem
                      title="Analytics"
                      href="#"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 3v18h18" />
                          <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                      }
                    >
                      Track performance with detailed click statistics
                    </ListItem>
                    <ListItem
                      title="Custom Links"
                      href="#"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                        </svg>
                      }
                    >
                      Personalize your shortened URLs
                    </ListItem>
                    <ListItem
                      title="QR Codes"
                      href="#"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="6" height="6" x="3" y="3" rx="1" />
                          <rect width="6" height="6" x="15" y="3" rx="1" />
                          <rect width="6" height="6" x="3" y="15" rx="1" />
                          <path d="M21 15h-2" />
                          <path d="M21 18h-2" />
                          <path d="M21 21h-2" />
                          <path d="M15 21h2" />
                        </svg>
                      }
                    >
                      Generate QR codes for your shortened links
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-all duration-200 hover:bg-accent/80",
                      isActive("/about") &&
                        "font-medium text-primary bg-primary/10 hover:bg-primary/15"
                    )}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {showAuthButton &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 flex items-center border-primary/20 hover:bg-primary/5 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.firstName
                        ? user.firstName[0].toUpperCase()
                        : <User className="h-4 w-4" />}
                    </div>
                    <span className="font-medium">
                      {user.firstName || user.email.split("@")[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  sideOffset={8}
                  alignOffset={0}
                >
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>My Account</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/user-urls")}
                    className="flex items-center cursor-pointer"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My URLs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/sign-up")}
                  className="hover:bg-primary/5 transition-all"
                >
                  Sign up
                </Button>
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign in</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/80 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] overflow-y-auto max-w-sm pt-12">
              <nav className="flex flex-col gap-2 ">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <div className="p-2 rounded-md bg-gradient-to-br from-primary/20 to-primary/5">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">UrlShortener</span>
                </div>

                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200",
                    isActive("/") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>

                {isProtectedRoute && (
                  <Link
                    href="/user-urls"
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200",
                      isActive("/user-urls") &&
                        "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                    )}
                  >
                    <LinkIcon className="h-5 w-5" />
                    My URLs
                  </Link>
                )}

                {useDefaultLinks && (
                  <>
                    <div
                      className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200 cursor-pointer"
                      onClick={() => router.push("/#features")}
                    >
                      <Zap className="h-5 w-5" />
                      Features
                    </div>

                    <Link
                      href="/about"
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200",
                        isActive("/about") &&
                          "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                      )}
                    >
                      <Info className="h-5 w-5" />
                      About
                    </Link>
                  </>
                )}

                {navs &&
                  navs.map((nav, index) => (
                    <Link
                      href={nav.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200",
                        isActive(nav.href) &&
                          "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                      )}
                      key={index}
                    >
                      {nav.icon && nav.icon}
                      {nav.name}
                    </Link>
                  ))}

                <div className="my-4 border-t" />

                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {user.firstName
                          ? user.firstName[0].toUpperCase()
                          : <User className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.firstName || user.email.split("@")[0]}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent/80 transition-all duration-200"
                    >
                      <Settings className="h-5 w-5" />
                      Profile Settings
                    </Link>

                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="mt-4 w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button
                      onClick={() => router.push("/sign-in")}
                      className="w-full"
                    >
                      Sign in
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/sign-up")}
                      className="w-full"
                    >
                      Create account
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

// Enhanced ListItem component for feature menu items
const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 focus:bg-accent focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <div className="text-primary group-hover:text-primary/80 transition-colors">
                {icon}
              </div>
            )}
            <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
              {title}
            </div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
