"use client";
import { URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { createShortUrl } from "@/app/api/urls/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Auth";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, CheckCircle2, Link2, Loader2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrls } from "@/context/_Urls";
// import { useUrls } from "@/context/Urls";

export const CreateUrlPage = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [recentUrls, setRecentUrls] = useState<
    Array<{ original: string; short: string; shortCode: string }>
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const shortUrlRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const { loadPage, totalUrlCount } = useUrls();

  // Load recent URLs from localStorage on initial render
  useEffect(() => {
    const savedUrls = localStorage.getItem("recentUrls");
    if (savedUrls) {
      try {
        setRecentUrls(JSON.parse(savedUrls));
      } catch (e) {
        console.error(
          e instanceof Error ? e.message : "Failed to parse saved URLs"
        );
      }
    }
  }, []);

  // Validate URL as user types with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.trim()) {
        try {
          validateUrl(url);
          setIsUrlValid(true);
          setError(null);
        } catch {
          setIsUrlValid(false);
          setError("Please enter a valid URL");
        }
      } else {
        setIsUrlValid(null);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Auto-focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to result when shortCode is available
  useEffect(() => {
    if (shortCode && shortUrlRef.current) {
      shortUrlRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [shortCode]);

  const validateUrl = (inputUrl: string): string => {
    try {
      if (!inputUrl.match(/^https?:\/\//)) {
        inputUrl = `https://${inputUrl}`;
      }
      return new URL(inputUrl).toString();
    } catch {
      throw new Error("Invalid URL format");
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setError(null);
    setShortCode(null);
    setIsLoading(true);

    try {
      const validUrl = validateUrl(url);
      const { short_code } = await createShortUrl(
        validUrl,
        user?.uid as string
      );
      console.log("totals, totals + 1: ", totalUrlCount, totalUrlCount + 1);
      loadPage(1, totalUrlCount);
      console.log("ALLTOTALURLS + 1", totalUrlCount + 1);

      setShortCode(short_code);
      const shortUrl = `${URL_SERVICE_API_BASE_URL}/${short_code}`;

      // Add to recent URLs
      const newRecentUrl = {
        original: validUrl,
        short: shortUrl,
        shortCode: short_code,
      };
      const updatedRecentUrls = [newRecentUrl, ...recentUrls.slice(0, 4)];
      setRecentUrls(updatedRecentUrls);
      localStorage.setItem("recentUrls", JSON.stringify(updatedRecentUrls));

      toast.success("URL shortened successfully!");
      setUrl("");
      setIsUrlValid(null);
    } catch (e) {
      console.error("Failed to create short url", e);
      setError(e instanceof Error ? e.message : "Failed to create short URL");
      toast.error(
        e instanceof Error ? e.message : "Failed to create short URL"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url.trim() && isUrlValid) {
      handleCreate();
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          URL Shortener
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Simplify your links and track clicks with our powerful URL shortening
          tool
        </p>
      </motion.div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create Short URL</CardTitle>
          <CardDescription>
            Enter a long URL to generate a short, shareable link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    className={cn(
                      "pr-10 h-12 text-base transition-all duration-200",
                      isUrlValid === true &&
                        "border-green-500 focus-visible:ring-green-500",
                      isUrlValid === false &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    aria-label="URL to shorten"
                  />
                  <div className="absolute right-3 top-3 pointer-events-none">
                    {isUrlValid === true && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {isUrlValid === false && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !url.trim() || isUrlValid === false}
                  className="w-[120px] h-12 transition-all duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Shortening" : "Shorten"}
                </Button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 ml-1"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </form>
        </CardContent>

        <AnimatePresence>
          {shortCode && (
            <motion.div
              ref={shortUrlRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <Tabs defaultValue="link" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="link">Short Link</TabsTrigger>
                    <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="link" className="mt-0">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                          <a
                            href={`${URL_SERVICE_API_BASE_URL}/${shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline truncate mr-2"
                          >
                            {`${URL_SERVICE_API_BASE_URL}/${shortCode}`}
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `${URL_SERVICE_API_BASE_URL}/${shortCode}`
                              )
                            }
                            aria-label="Copy to clipboard"
                          >
                            {copied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="qrcode" className="mt-0">
                    <Card>
                      <CardContent className="pt-4 flex justify-center">
                        <div className="p-4 bg-white rounded-lg">
                          <QRCode
                            // title="QR Code for shortened URL"
                            value={`${URL_SERVICE_API_BASE_URL}/${shortCode}`}
                            size={180}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {recentUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recently Shortened URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentUrls.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 truncate max-w-[70%]">
                        <p className="text-sm text-muted-foreground truncate">
                          {item.original}
                        </p>
                        <a
                          href={item.short}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-primary hover:underline"
                        >
                          {`${URL_SERVICE_API_BASE_URL}/${item.shortCode}`}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(item.short)}
                        aria-label="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
