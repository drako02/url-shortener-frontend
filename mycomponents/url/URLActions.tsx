import { ShortUrl } from "@/app/api/types";
import { memo, useCallback, useState } from "react";
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
import { boolean } from "zod";
import { auth } from "@/firebaseConfig";
import { APIError, APIResponse, fetchRequest } from "@/app/api/helpers";
import { Switch } from "@/components/ui/switch";

export const Actions: React.FC<{
  url: ShortUrl;
  className?: string;
  itemClassName?: string;
}> = memo(({ url, className, itemClassName }) => {
  const { refreshUrls } = useUrls();
  const [copied, setCopied] = useState(false);
  // const [checked, setChecked] = useState(true);
  const {active, updateActiveState, updating: isUpdating} = useToggleActive(url.id, url.active)
  console.log({active})

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
              {copied ? (
                <CheckCircle className="h-4 w-4 animate-in zoom-in-50 duration-300" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Switch
            disabled={isUpdating}
              checked={active}
              onCheckedChange={() => {
                updateActiveState()
              }}
              // className={cn(
              //   "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200",
              //   "transition-all duration-200",
              //   "focus-visible:ring-offset-2 focus-visible:ring-blue-500",
              //   "active:scale-95",
              //   itemClassName
              // )}
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "2.25rem", // 36px
                height: "1.25rem", // 20px
                borderRadius: "9999px",
                backgroundColor: active
                  ? "#2563EB" // bg-blue-600
                  : "#E5E7EB", // bg-gray-200
                transition: "background-color 0.2s ease-in-out",
                cursor: "pointer",
                opacity: 1,
              }}
            />
            {/* <Button
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
            </Button> */}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Active State</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
Actions.displayName = "Actions";

const updateUrlStatus = async (id: number, value: boolean) => {
  try {
    const path = `/api/urls/set-active/${id}?status=${value}`;
    console.log("pathname", path);

    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      return false;
    }

    const res = await fetchRequest<APIResponse<unknown>>(path, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    });

    if (!res.success) {
      toast.error(res.message || "Something went wrong");
      return false;
    }

    toast.success("URL status changed successfully");
    return true;
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
    return false;
  }
};

const useToggleActive = (id: number, initial: boolean) => {
  const [active, setActive] = useState(initial);
  const [updating, setUpdating] = useState(false);

  // const newActive = !active;
  // setActive(prev => );

  const updateActiveState = useCallback(async () => {
    setUpdating(true);
    setActive(prev => !prev)

    const previous = active

    const res = await updateUrlStatus(id, !previous);

    if (!res) {
      setActive(previous);
      setUpdating(false);
      return
    }

    // setActive(prev => !prev)
    setUpdating(false);
  }, [active, id]);

  return {active, updating,  updateActiveState}
};
