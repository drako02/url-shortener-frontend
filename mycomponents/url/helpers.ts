import {
  fetchRequest,
  logError,
  URL_SERVICE_API_BASE_URL,
} from "@/app/api/helpers";
import { auth } from "@/firebaseConfig";

export const deleteUrl = async (id: number) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    const token = await auth.currentUser.getIdToken();

    const res = await fetchRequest("/api/urls/", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: { id },
    });

    return { success: true, data: res, error: null };
  } catch (error) {
    logError({
      context: "deleting url",
      error,
      message: "",
      logLevel: "error",
    });
    return { success: false, data: null, error };
  }
};

export const copyUrl = (URLShortCode: string) => {
  navigator.clipboard.writeText(`${URL_SERVICE_API_BASE_URL}/${URLShortCode}`);
};
