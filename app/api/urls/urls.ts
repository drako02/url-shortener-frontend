import { GO_SERVICE_BASE_URL, request } from "../helpers";

export const createShortUrl = async (url: string, uid: string) => {
  try {
    const res = await request<{ short_code: string; long_url: string }>(
      `${GO_SERVICE_BASE_URL}/create`,
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
  limit: number,
  offset: number
) => {
  try {
    const res = await request<{
      recordCount: number;
      urls: {
        id: number;
        short_code: string;
        long_url: string;
        created_at: Date;
        updated_at: Date;
        user_id: number;
      }[];
    }>(`${GO_SERVICE_BASE_URL}/user-urls`, {
      method: "POST",
      body: { uid, limit, offset },
    });

    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
