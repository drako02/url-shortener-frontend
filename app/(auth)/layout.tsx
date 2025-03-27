"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const router = useRouter();
  const isSignUp = pathName === "/sign-up";

  return (
    <div className="flex flex-col md:flex-row h-full min-h-svh">
      {/* Back button for mobile only */}
      <div className="p-4 block md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
      </div>

      {/* Left panel with background image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block md:w-3/5 lg:w-2/3 relative"
      >
        <div
          className={`${
            isSignUp ? "bg-signup-image" : "bg-signin-image"
          } absolute inset-0 bg-cover bg-center rounded-r-lg`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30 rounded-r-lg" />
        
        {/* Branding overlay on the image */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
          <div>
            <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              URL Shortener
            </Link>
          </div>
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {isSignUp ? "Join our community" : "Welcome back"}
            </h1>
            <p className="text-lg opacity-90 max-w-md">
              {isSignUp 
                ? "Create an account to start shortening your URLs and track their performance." 
                : "Sign in to access your shortened links and analytics."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right panel with form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-center items-center p-4 md:p-8"
      >
        <div className="w-full max-w-md">
          {/* Auth form container */}
          <div className="mb-6 text-center md:text-left md:hidden">
            <h1 className="text-2xl font-bold">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? "Enter your details to get started" 
                : "Enter your credentials to access your account"}
            </p>
          </div>
          
          {children}
          
          {/* Form switcher */}
          {/* <div className="mt-6 text-center text-sm">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link 
                href={isSignUp ? "/sign-in" : "/sign-up"} 
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}
