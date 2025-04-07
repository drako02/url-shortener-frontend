import { URL_SERVICE_API_BASE_URL, fetchRequest } from "../helpers";
import { UserResponse } from "../types";
// import { headers } from "next/headers";
// import { NextRequest } from "next/server";

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

  const res = await fetchRequest<UserResponse>(`${URL_SERVICE_API_BASE_URL}/users`, {
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
  const res = await fetchRequest<{ result: boolean }>(
    `${URL_SERVICE_API_BASE_URL}/users/exists`,
    {
      method: "POST",
      body: {
        email,
      },
    }
  );

  return res.result;
};

export const getUser = async (uid: string, idToken: string) => {
  const headers: Record<string, string> = {};
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const user = await fetchRequest<UserResponse>(`${URL_SERVICE_API_BASE_URL}/users/${uid}`, {
    headers,
  });
  return user;
};
