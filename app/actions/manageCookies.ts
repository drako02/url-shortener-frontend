"use server"
import { cookies } from "next/headers";

export async function deleteSessionCookies() {
  cookies().then(cookies => cookies.delete("session"));
  cookies().then(cookies => cookies.delete("uid"));
  // cookies().then(cookies => cookies.delete("userData"));

//   cookies().delete("uid");
//   cookies().delete("userData");
}