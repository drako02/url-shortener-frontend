export type User = {
  firstName?: string;
  lastName?: string;
  email: string;
  uid: string;
  joinedAt: Date;
};

export type UserResponse = {
  first_name?: string;
  last_name?: string;
  uid: string;
  email: string;
  joined_at: string;
};

export type ClicksResponse = {
  id: string;
  shortCode: string;
  timestamp: string;
  userId: string;
};

export interface URLResponse {
  id: number;
  short_code: string;
  long_url: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface ShortUrl {
  id: number;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type FilterOperator =
  | "eq" // equals
  | "ne" // not equals
  | "gt" // greater than
  | "lt" // less than
  | "contains" // contains substring
  | "starts_with"
  | "ends_with"
  | "between"
  | "fulltext";

export type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: unknown; // Single value for most operators
  values?: unknown[]; // Multiple values for 'between' operator
} | FulltextCondtion

export type FulltextCondtion = {
  fields: string[] // for fulltext queries
  operator: "fulltext";
  value: unknown
}

export interface UrlQuery {
  limit?: number;
  offset?: number;
  filters?: FilterCondition[];
  sortBy?: string;
  sortOrder?: "desc" | "asc";
  uid: string;
}
