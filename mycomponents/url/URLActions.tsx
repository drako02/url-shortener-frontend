import { ShortUrl } from "@/app/api/types";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { copyUrl, deleteUrl } from "./helpers";
import { useUrls } from "@/context/_Urls";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Actions: React.FC<{
  url: ShortUrl;
  className?: string;
  itemClassName?: string;
}> = memo(({ url, className, itemClassName }) => {
  const { refreshUrls } = useUrls();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    copyUrl(url.shortCode);
    setCopied(true);
    toast.success("Short URL copied to clipboard", {
      richColors: true,
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDelete = async () => {
    const res = await deleteUrl(url.id);
    await refreshUrls();
    if (res.success) {
      toast.success(`URL with id ${url.id} deleted successfully`, {
        richColors: true,
      });
    } else {
      toast.error("Failed to delete url. Something went wrong", {
        richColors: true,
      });
    }
  };

  return (
    <div className={cn("flex items-center gap-2 w-auto h-full", className)}>
      <TooltipProvider>
        {/* Copy button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 rounded-full p-0 transition-all", 
                "hover:bg-blue-100 hover:text-blue-600 active:scale-95",
                copied && "bg-green-100 text-green-600",
                itemClassName
              )}
              onClick={handleCopy}
            >
              {copied ? 
                <CheckCircle className="h-4 w-4 animate-in zoom-in-50 duration-300" /> : 
                <Copy className="h-4 w-4" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Copy short URL</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 rounded-full p-0 transition-all",
                "hover:bg-red-100 hover:text-red-600 active:scale-95",
                itemClassName
              )}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Delete URL</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
Actions.displayName = "Actions";
