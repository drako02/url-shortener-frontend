import { request } from "./helpers";

const BASE_API_URL = "http://localhost:8080";
type AddUserRequest = {
  first_name?: string;
  last_name?: string;
  uid: string;
};

export async function addUser(payload: AddUserRequest) {
  const { first_name, last_name, uid } = payload;
  const res = await request(`${BASE_API_URL}/users`, {
    method: "POST",
    body: {
      first_name,
      last_name,
      uid,
    },
  });
  return res
}
