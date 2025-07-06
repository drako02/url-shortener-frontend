import { ShortUrl } from "@/app/api/types";
import { Actions } from "@/mycomponents/url/URLActions";
import { format, formatDistance } from "date-fns";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

// type URL = {
//   Id: React.FC<{ id: number }>;
//   ShortUrl: React.FC<{ base: string; code: string }>;
//   OriginalUrl: React.FC<{ url: string }>;
//   CreatedAt: React.FC<{ createdAt: Date }>;
//   Clicks: React.FC<{ clicks: number }>;
//   Actions: React.FC<{ url: ShortUrl }>;
// };

type URL = {
    Id: (props: { id: number }) => ReactElement;
    ShortUrl: (props: { base: string; code: string }) => ReactElement;
    OriginalUrl: (props: { url: string }) => ReactElement;
    CreatedAt: (props: { createdAt: Date }) => ReactElement;
    Clicks: (props: { clicks: number }) => ReactElement;
    Actions: (props: { url: ShortUrl }) => ReactElement;
  };

export const URLCOMPONENTS: URL = {
  Id: ({ id }) => (
    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
      #{id}
    </span>
  ),

  ShortUrl: ({ base, code }) => (
    <Link
      href={`${base}/${code}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      <div className="flex items-center justify-center p-1 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
        <LinkIcon
          size="12"
          className="text-blue-500 group-hover:text-blue-700"
        />
      </div>
      <span className="underline underline-offset-2 decoration-blue-200 group-hover:decoration-blue-400">
        {code}
      </span>
    </Link>
  ),

  OriginalUrl: ({ url }) => {
    const urlToDisplay = url.length > 45 ? url.substring(0, 45) + "..." : url;
    return (
      <div className="flex flex-col">
        <span className="truncate max-w-[250px]">{urlToDisplay}</span>
        <span className="text-xs text-slate-400 truncate max-w-[250px]">
          {new URL(url).hostname}
        </span>
      </div>
    );
  },

  CreatedAt: ({ createdAt }) => {
    const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
    const dateCreated = new Date(createdAt);
    const ageInMs = Date.now() - dateCreated.getTime();
    const isRecent = ageInMs < FOUR_DAYS_MS;

    const dateDisplay =
      ageInMs < FOUR_DAYS_MS
        ? formatDistance(dateCreated, new Date(), { addSuffix: true })
        : format(dateCreated, "PPp");

    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${
            isRecent ? "bg-green-400" : "bg-slate-300"
          }`}
        ></div>
        <span className={`${isRecent ? "text-slate-800" : "text-slate-600"}`}>
          {dateDisplay}
        </span>
      </div>
    );
  },

  Clicks: ({ clicks }) => <p className="flex flex-1">{clicks}</p>,
  Actions: ({ url }) => {
    return (
      <div className="flex justify-end w-full">
        <Actions url={url} className="justify-end" />
      </div>
    );
  },
};
