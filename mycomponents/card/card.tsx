import { URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
import { ShortUrl, URLResponse } from "@/app/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, formatDate } from "date-fns";
import { LinkIcon } from "lucide-react";

interface URLCardProps {
  url: ShortUrl;
  className?: string;
  actions?: React.ReactElement;
}

const flex = {
  rowCenter: "flex flex-row justify-center items-center",
  columnCenter: "flex flex-col justify-center items-center",
  columnBetween: "flex flex-col justify-between items-center",
};
export const URLCard: React.FC<URLCardProps> = ({ url, className, actions }) => {
  const randomColor = getRandomColor(url.shortCode);
  const randomColorTW = `bg-[${randomColor}]`;
  console.log({ randomColorTW });

  return (
    <>
      <Card className={cn(" card w-[90vw] h-28", className)}>
        <CardContent className=" h-full p-0">
          <div className=" div-1 flex  h-full justify-between items- px-4 py-4">
            <div className="h-full w-[12%]  flex flex-col justify-between">
              {/* <LinkIcon /> */}
              <Badge
                className={cn(" aspect-[1] text-[1.5em] ", flex.rowCenter)}
                style={{ backgroundColor: randomColor }}
              >
                {" "}
                {url.shortCode.slice(0, 1).toUpperCase()}{" "}
              </Badge>
              <p className="text-center ">{"#" + url.id}</p>
            </div>

            <div className={cn(flex.columnBetween, "items-start ")}>
              <p className="text-[0.8rem] font-medium text-gray-500">
                {format(url.createdAt, "dd MMM yyyy")}
              </p>
              <h1 className="font-bold">{`${URL_SERVICE_API_BASE_URL}/${url.shortCode}`}</h1>
              <p className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap font-[650] text-[0.9rem] text-gray-400">
                {url.originalUrl}
              </p>
            </div>

            <div>{actions}</div>
          </div>
        </CardContent>
      </Card>
    </>
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
