"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Clock, Lock, LinkIcon } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { MainHeader } from "@/mycomponents/headers/header";
import { useAuth } from "@/context/Auth";
import Image from "next/image";

export default function Home() {
  const { isAuthenticated } = useAuth();
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

  const itemVariants:Variants = {
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

  const mobileHeaderOptions = [
    { name: "My Urls", href: "/user-urls", icon: <LinkIcon /> },
  ];

  return (
    <>
      <MainHeader navs={isAuthenticated ? mobileHeaderOptions : []} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden rounded-xl p-8"
          style={{
            background: "linear-gradient(to right, #f0f9ff, #e0f2fe, #bae6fd)",
            backgroundSize: "cover",
          }}
        >
          {/* Add decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

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
              <div className="aspect-video bg-gradient-to-br from-card to-slate-50 p-4 rounded-lg relative">
                {/* Browser mockup */}
                <div className="bg-white rounded-md w-full shadow-lg">
                  <div className="flex items-center bg-gray-100 px-4 py-2 border-b rounded-t-md">
                    <div className="flex space-x-1">
                      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 ml-4 bg-white rounded-md h-5"></div>
                  </div>

                  <div className="p-4">
                    <Image
                      src={""}
                      alt="URL Shortener in action"
                      width={48}
                      height={48}
                      className="w-full h-auto rounded shadow-inner"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400/4f46e5/ffffff?text=URL+Shortener";
                      }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-green-500 text-white shadow rounded-full px-4 py-1.5 border border-green-600 text-sm font-medium animate-pulse">
                  URL Shortened! 🚀
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
            {features.map((feature, index) => {
              // Create different color backgrounds for each feature card
              const bgColors = [
                "from-blue-50 to-indigo-50 border-blue-200",
                "from-emerald-50 to-teal-50 border-emerald-200",
                "from-amber-50 to-yellow-50 border-amber-200",
              ];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                  className={`bg-gradient-to-br ${bgColors[index]} p-6 rounded-lg border shadow-sm hover:shadow-md transition-all`}
                >
                  <div
                    className={`rounded-full w-14 h-14 flex items-center justify-center mb-4 bg-white shadow-sm`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>

                  {/* Add illustration */}
                  <Image
                    src={`/features/feature-${index + 1}.svg`}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="w-24 h-24 mt-4 mx-auto opacity-80"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      const icons = ["📊", "⚡", "🔒"];
                      e.currentTarget.outerHTML = `<div class="text-5xl text-center mt-4">${icons[index]}</div>`;
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-24 py-12 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by thousands
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our users have to say about our service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {[
              {
                name: "Alex Morgan",
                role: "Marketing Director",
                quote:
                  "This tool has simplified our campaign tracking tremendously!",
                avatar: "https://i.pravatar.cc/150?img=32",
              },
              {
                name: "Jamie Chen",
                role: "Content Creator",
                quote:
                  "I use it daily for my social media links. Clean, fast, reliable.",
                avatar: "https://i.pravatar.cc/150?img=44",
              },
              {
                name: "Taylor Wilson",
                role: "E-commerce Owner",
                quote:
                  "The analytics feature helps me understand which products get the most interest.",
                avatar: "https://i.pravatar.cc/150?img=12",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="italic text-slate-600">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-3 text-amber-500">★★★★★</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-24 bg-gradient-to-br from-primary/90 to-primary-dark border border-primary/20 rounded-xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg"
        >
          {/* Add decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full"></div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white relative z-10">
            Ready to shorten your first URL?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto relative z-10">
            Join thousands of users who trust our service for their link
            shortening needs. No credit card required, get started for free.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="px-8 bg-white text-primary hover:bg-white/90 shadow-md relative z-10"
          >
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
