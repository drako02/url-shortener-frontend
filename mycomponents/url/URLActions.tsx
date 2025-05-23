import { ShortUrl } from "@/app/api/types";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { copyUrl, deleteUrl } from "./helpers";
import { useUrls } from "@/context/_Urls";
import { cn } from "@/lib/utils";

export const Actions: React.FC<{
  url: ShortUrl;
  className?: string;
  itemClassName?: string;
}> = memo(({ url, className, itemClassName }) => {
  const { refreshUrls } = useUrls();
  return (
    <div className={cn("flex w-[80px] h-full", className)}>
      {/* Copy button */}
      <Button
        asChild
        variant="ghost"
        className={cn("h-[24px] p-1", itemClassName)}
        onClick={() => {
          copyUrl(url.shortCode);
          toast.success("Short URL copied to clipboard", {
            richColors: true,
          });
        }}
      >
        <Copy size={"50%"} />
      </Button>

      {/* Delete button */}
      <Button
        asChild
        variant="ghost"
        className={cn("h-[24px] p-1", itemClassName)}
        onClick={async () => {
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
        }}
      >
        <Trash2 size={"50%"} />
      </Button>
    </div>
  );
});
Actions.displayName = "Actions";
