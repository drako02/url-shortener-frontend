import { URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { ShortUrl } from "@/app/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMemo } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface URLCardProps {
  url: ShortUrl;
  className?: string;
  actions?: React.ReactElement;
}

export const URLCard: React.FC<URLCardProps> = ({
  url,
  className,
  actions,
}) => {
  const randomColor = useMemo(() => getRandomColor(url.shortCode), [url.shortCode]);
  
  // Determine if text should be white or black based on background color
  const textColor = useMemo(() => {
    const r = parseInt(randomColor.slice(1, 3), 16);
    const g = parseInt(randomColor.slice(3, 5), 16);
    const b = parseInt(randomColor.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? 'text-gray-800' : 'text-white';
  }, [randomColor]);

  const shortUrl = `${URL_SERVICE_API_BASE_URL}/${url.shortCode}`;
  const domain = (URL_SERVICE_API_BASE_URL as string).replace(/^https?:\/\//, '');
  

  return (
    <Card className={cn("w-full overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-0">
        <div className="flex items-stretch h-full">
          {/* Left color badge section */}
          <div className="hidden xxs:flex flex-col items-center justify-center px-3 py-4" 
               style={{ backgroundColor: `${randomColor}20` /* 20% opacity */ }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full mb-1.5 shadow-sm"
                 style={{ backgroundColor: randomColor }}>
              <span className={cn("text-xl font-bold", textColor)}>
                {url.shortCode.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded">
              #{url.id}
            </span>
          </div>

          {/* Middle content section */}
          <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {format(url.createdAt, "dd MMM yyyy")}
              </span>
              <span className="xxs:hidden text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                #{url.id}
              </span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 font-medium text-primary hover:text-primary/80"
                  >
                    <span className="truncate">
                      {domain}/<span className="font-bold">{url.shortCode}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open shortened URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-500 truncate max-w-full mt-1 cursor-help">
                    {url.originalUrl}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{url.originalUrl}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right actions section */}
          {actions && (
            <div className="flex items-center border-l border-gray-100 bg-gray-50/50 px-3 py-3">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function getRandomColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash to hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
}
