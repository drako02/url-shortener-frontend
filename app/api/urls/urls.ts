import { URL_SERVICE_API_BASE_URL, fetchRequest } from "../helpers";

export const createShortUrl = async (url: string, uid: string) => {
  try {
    const res = await fetchRequest<{ short_code: string; long_url: string }>(
      `${URL_SERVICE_API_BASE_URL}/create`,
      {
        method: "POST",
        body: { url, uid },
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
  try {
    const res = await fetchRequest<{
      recordCount: number;
      urls: {
        id: number;
        short_code: string;
        long_url: string;
        created_at: string;
        updated_at: string;
        user_id: number;
      }[];
    }>(`${URL_SERVICE_API_BASE_URL}/user-urls`, {
      method: "POST",
      body: { uid, limit, offset },
    });

  return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
