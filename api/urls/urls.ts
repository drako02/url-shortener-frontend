import { BASE_API_URL, request } from "../helpers";

export const createShortUrl = async (url: string, uid: string) => {
    try {
      const res = await request<{ short_code: string; long_url: string }>(
        `${BASE_API_URL}/create`,
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
