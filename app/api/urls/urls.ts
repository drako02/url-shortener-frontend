import { auth } from "@/firebaseConfig";
import { URL_SERVICE_API_BASE_URL, fetchRequest } from "../helpers";
import { URLResponse } from "../types";

export const createShortUrl = async (url: string, uid: string) => {
  try {
    const token  = await auth.currentUser?.getIdToken();
    const res = fetchRequest<{ short_code: string; long_url: string }>(
      `${URL_SERVICE_API_BASE_URL}/create`,
      {
        method: "POST",
        body: { url, uid },
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res;
  } catch (error) {
    console.error("Failed to create short URL:", error);
    throw error;
  }
};

export const getShortUrls = async (
  uid: string,
  limit?: number,
  offset?: number
) => {
  const token  = await auth.currentUser?.getIdToken();
  try {
    const res = fetchRequest<{
      recordCount: number;
      urls: URLResponse[];
    }>(`${URL_SERVICE_API_BASE_URL}/user-urls`, {
      method: "POST",
      body: { uid, limit, offset },
      headers:{
        Authorization: `Bearer ${token}`
      }
    });

  return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

