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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LinkIcon, Menu, User, LogOut, ChevronDown, Home, Info, Zap } from "lucide-react";

const protectedRoutes = ["/home", "/home/user-urls"];
const excludeRoutes = ["/sign-in", "/sign-up"];

export const MainHeader = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const showAuthButton = !excludeRoutes.includes(pathName);
  const isProtectedRoute = protectedRoutes.some(route => pathName?.startsWith(route));
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">UrlShortener</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/") && "font-medium text-primary"
                  )}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {isProtectedRoute && (
                <NavigationMenuItem>
                  <Link href="/home/user-urls" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/home/user-urls") && "font-medium text-primary"
                    )}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      My URLs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Zap className="mr-2 h-4 w-4" />
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem title="URL Shortening" href="#">
                      Create compact, shareable links in seconds
                    </ListItem>
                    <ListItem title="Analytics" href="#">
                      Track performance with detailed click statistics
                    </ListItem>
                    <ListItem title="Custom Links" href="#">
                      Personalize your shortened URLs
                    </ListItem>
                    <ListItem title="QR Codes" href="#">
                      Generate QR codes for your shortened links
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/about") && "font-medium text-primary"
                  )}>
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {showAuthButton && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 flex items-center">
                    <User className="h-4 w-4" />
                    <span>{user.firstName || user.email}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/home/user-urls')}>
                    My URLs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign up
                </Button>
                <Button 
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
              </div>
            )
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 pt-4">
                <Link 
                  href="/"
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                    isActive("/") && "bg-accent"
                  )}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                
                {isProtectedRoute && (
                  <Link 
                    href="/home/user-urls"
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                      isActive("/home/user-urls") && "bg-accent"
                    )}
                  >
                    <LinkIcon className="h-5 w-5" />
                    My URLs
                  </Link>
                )}
                
                <Link 
                  href="#features"
                  className="flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent"
                >
                  <Zap className="h-5 w-5" />
                  Features
                </Link>
                
                <Link 
                  href="/about"
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                    isActive("/about") && "bg-accent"
                  )}
                >
                  <Info className="h-5 w-5" />
                  About
                </Link>
                
                <div className="my-2 border-t" />
                
                {user ? (
                  <>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Signed in as {user.email}
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="mt-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Button onClick={() => router.push("/sign-up")}>
                      Sign up
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/sign-in")}>
                      Sign in
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

// Helper component for feature menu items
const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
