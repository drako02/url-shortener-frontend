export type UrlData = {
  id: number;
  short_code: string;
  long_url: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  visits?: number;
};

export type UrlContextProps = {
  // urls: UrlData[];
  urls: Map<number, UrlData>;
  allUrlsTotal: number;
  initializing: boolean;
  updateUrls: (
    limit: number,
    offset: number,
    queryString?: string
  ) => Promise<void>;
};
