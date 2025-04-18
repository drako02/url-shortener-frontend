import { URLResponse, ShortUrl, User, UserResponse } from "./types";

interface RequestOptions {
  method?: "POST" | "PUT" | "GET" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
}

export const URL_SERVICE_API_BASE_URL = process.env.NEXT_PUBLIC_GO_SERVICE_BASE_URL;
export const ANALYTICS_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_BASE_URL;
console.log({GO_SERVICE_BASE_URL: URL_SERVICE_API_BASE_URL, ANALYTICS_SERVICE_BASE_URL})

export const fetchRequest = async <T>(
  url: string,
  options: RequestOptions
): Promise<T > => {
  const { method = "GET", headers = {}, body } = options;

  console.log(`🚀 API Request: ${method} ${url}`, {
    method,
    headers,
    body: body || 'no body',
  });

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

    console.log(`📥 API Response: ${method} ${url}`, {
      status: response.status,
      statusText: response.statusText,
    });

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const jsonResponse = await response.json();
      console.log(`📦 API Response Data:`, jsonResponse);
      return jsonResponse;
    }
    console.log("returned text")
    return response.text() as Promise<T>;
    
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network request failed");
  }
};

export const mapToUser = (backendUser: UserResponse): User => ({
  firstName: backendUser.first_name,
  lastName: backendUser.last_name,
  uid: backendUser.uid,
  email: backendUser.email,
  joinedAt: new Date(backendUser.joined_at),
});

export interface ErrorLog {
  message: string;
  error: Error;
  context: string; // What operation was being performed when the error occurred
  timestamp?: Date;
}
type LogErrorParams = {
  context: string;
  error: unknown;
  message: string;
  logLevel: "warn" | "error";
};

export const logError = ({
  context, error, message, logLevel,
}: LogErrorParams) => {
  const errorLog: ErrorLog = {
    message,
    error: error instanceof Error ? error : new Error(String(error)),
    context,
    timestamp: new Date(),
  };

  console[logLevel](errorLog);
};

export const mapToURL = (backendURL: URLResponse): ShortUrl => ({
  id: backendURL.id,
  shortCode: backendURL.short_code,
  originalUrl: backendURL.long_url,
  createdAt: new Date(backendURL.created_at),
  updatedAt: new Date(backendURL.updated_at),
  userId: backendURL.user_id
});