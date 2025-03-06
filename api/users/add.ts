import { BASE_API_URL, request } from "../helpers";
import { UserResponse } from "../types";

type AddUserRequest = {
  first_name?: string;
  last_name?: string;
  uid: string;
  email: string;
};



export async function addUser(payload: AddUserRequest) {
  const { first_name, last_name, uid, email } = payload;
  const exists = await userExists(email);
  if (exists) {
    // console.log({exists})
    throw new Error("User already esists");
    // return
  }

  const res = await request<UserResponse>(`${BASE_API_URL}/users`, {
    method: "POST",
    body: {
      first_name,
      last_name,
      uid,
      email,
    },
  });
  return res;
}

export const userExists = async (email: string): Promise<boolean> => {
  const res = await request<{ result: boolean }>(
    `${BASE_API_URL}/users/exists`,
    {
      method: "POST",
      body: {
        email,
      },
    }
  );

  return res.result;
};

export const getUser = async (uid: string) => {
  const user = await request<UserResponse>(`${BASE_API_URL}/users/${uid}`,{});
  return user
};
