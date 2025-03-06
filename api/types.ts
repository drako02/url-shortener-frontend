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