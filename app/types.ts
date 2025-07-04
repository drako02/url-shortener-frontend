// import { FilterProps } from "@/hooks/search";

import { FilterCondition } from "./api/types";

export type UrlData = {
  id: number;
  short_code: string;
  long_url: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  clicks?: number;
};

export type UrlContextProps = {
  // urls: UrlData[];
  urls: Map<number, UrlData>;
  totalUrlCount: number;
  initializing: boolean;
  updateUrls: (
    limit: number,
    offset: number,
    queryString?: string
  ) => Promise<void>;
  filter: (props: FilterProps) => {queryString: string};
  currentQueryString: string;
  // filterItems: {queryString: string, params: FilterProps}
  isNavigating: boolean;
  setNavigatingState: (state: boolean) => void;

};

export interface FilterProps {
  filters: FilterCondition[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}
