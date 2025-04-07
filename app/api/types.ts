export type User = {
    firstName?: string;
    lastName?: string;
    email: string;
    uid: string;
    joinedAt: Date;
}

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
}

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