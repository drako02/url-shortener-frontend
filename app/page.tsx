"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Clock, Lock, LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainHeader } from "@/mycomponents/headers/header";
import { useAuth } from "@/context/Auth";



export default function Home() {
  const {isAuthenticated} = useAuth()
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Fast Shortening",
      description: "Create shortened links in seconds with just one click.",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Link Analytics",
      description: "Track clicks and monitor your link performance over time.",
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Secure & Reliable",
      description:
        "Your links are secure and will never expire unless you want them to.",
    },
  ];

  const mobileHeaderOptions = [{name: "My Urls", href: "/user-urls", icon:<LinkIcon/> }]

  return (
    <>
      <MainHeader navs={isAuthenticated ? mobileHeaderOptions : []} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Left column: Hero text and CTA */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Make your links <span className="text-primary">shorter</span>,
              <br className="hidden md:block" /> smarter, and more powerful.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Instantly shorten long URLs to make them easy to share across any
              platform. Start shortening now—it&apos;s fast, free, and
              effortless!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleGetStarted}
                className="group relative w-full sm:w-auto"
              >
                <span className="pr-2">Get Started</span>
                <ArrowRight
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isHovering ? "transform translate-x-1" : ""
                  }`}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/sign-in")}
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Right column: Interactive demo */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden border border-border shadow-2xl">
              <div className="aspect-video bg-card p-4 rounded-lg relative">
                <div className="bg-muted rounded-md w-full h-10 mb-4"></div>
                <div className="bg-muted/50 rounded-md w-3/4 h-4 mb-2"></div>
                <div className="bg-muted/50 rounded-md w-1/2 h-4 mb-6"></div>
                <div className="bg-primary/10 rounded-md w-full h-12 flex items-center px-4">
                  <div className="w-5/6 h-4 bg-primary/20 rounded mr-2"></div>
                  <div className="w-1/6 h-6 bg-primary rounded"></div>
                </div>
                <div className="absolute bottom-4 right-4 bg-card shadow rounded-full px-3 py-1 border border-border text-xs font-medium">
                  URL Shortened!
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-24 md:mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why choose our URL shortener?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform provides everything you need to manage and track your
              links effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow transition-shadow"
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-24 bg-card border border-border rounded-xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to shorten your first URL?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who trust our service for their link
            shortening needs. No credit card required, get started for free.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="px-8">
            Get Started For Free
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} URL Shortener. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
