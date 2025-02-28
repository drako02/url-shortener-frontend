interface RequestOptions {
  method?: "POST" | "PUT" | "GET" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: Record<string, any>;
}
export const request = async <T>(
  url: string,
  options: RequestOptions
): Promise<T> => {
  const { method = "GET", headers = {}, body } = options;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} `);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }
    return response.text() as Promise<T>;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network request failed");
  }
};
