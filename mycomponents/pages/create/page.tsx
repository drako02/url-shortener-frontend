"use client";
import { BASE_API_URL } from "@/api/helpers";
import { createShortUrl } from "@/api/urls/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CreateUrlPage = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  //   useEffect(() => {
  //     console.log({url})
  //   },[url])
  const validateUrl = (inputUrl: string): string => {
    try {
      if (!inputUrl.match(/^https?:\/\//)) {
        inputUrl = `https://${inputUrl}`;
      }
      return new URL(inputUrl).toString();
    } catch (e) {
      throw new Error("Invalid URL format");
    }
  };

  const handleCreate = async () => {
    setError(null);
    setShortCode(null);
    setIsLoading(true);
    try {
      const validUrl = validateUrl(url);
      const { short_code } = await createShortUrl(
        validUrl,
        user?.uid as string
      );
      setShortCode(short_code);
      toast.success("URL shortened successfully!");
      setUrl("");
      console.log({ short_code });
    } catch (e: any) {
      console.error("Failed to create short url");
      setError(e.message || "Failed to create short URL");
      toast.error(e.message || "Failed to create short URL");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <p className="mb-[20px] text-[2rem] font-semibold"> Create Short Url</p>
      <div className="flex flex-col items-center gap-4 h-[24%] mb-[10%] w-1/2">
        <Input
          className="h-full rounded-[999px] f"
          placeholder="Enter long url here"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          disabled={isLoading}
        ></Input>
        <Button
          className="h-full w-[200px] rounded-[999px]"
          onClick={handleCreate}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {shortCode && (
        <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
          <p className="text-green-800">URL shortened successfully!</p>
          <a
            href={`${BASE_API_URL}/${shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {`${BASE_API_URL}/${shortCode}`}
          </a>{" "}
        </div>
      )}
    </div>
  );
};
