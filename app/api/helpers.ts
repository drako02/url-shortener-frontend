import { auth } from "@/firebaseConfig";
import { URLResponse, ShortUrl, User, UserResponse } from "./types";
import qs from "qs";

interface RequestOptions {
  method?: "POST" | "PUT" | "GET" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  timeout?: number;
}

export const URL_SERVICE_API_BASE_URL =
  process.env.NEXT_PUBLIC_GO_SERVICE_BASE_URL;
export const ANALYTICS_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_BASE_URL;

export const fetchRequest = async <T>(
  url: string,
  options: RequestOptions
): Promise<T> => {
  const { method = "GET", headers = {}, body } = options;

  console.log(`🚀 API Request: ${method} ${url}`, {
    method,
    headers,
    body: body || "no body",
  });

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log({ token, currentUser: auth.currentUser });

    const abortController = new AbortController();
    const timeOutId = setTimeout(
      () => abortController.abort(),
      options.timeout ?? 10000
    );

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
      signal: abortController.signal,
    });

    clearTimeout(timeOutId);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) || {
        error: "Unknown error",
      };

      throw new APIError({
        message: errorData.error,
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        responseBody: errorData,
      });
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
    console.log("returned text");
    return response.text() as Promise<T>;
  } catch (error) {

    logError({
      context: "API request",
      error,
      message: error instanceof Error ? error.message : "API request failed",
      logLevel: "error"
    });

    throw error instanceof APIError
      ? error
      : new APIError({
          message: "An error occurred during the request",
          method,
          url,
          status: 500
        });
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
  context,
  error,
  message,
  logLevel,
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
  userId: backendURL.user_id,
  active: backendURL.active
});

export class APIError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly method: string;
  public readonly url: string;
  public readonly responseBody?: unknown;
  public readonly timestamp: Date;
  public readonly requestBody?: unknown;

  constructor({
    message,
    status,
    statusText,
    method,
    url,
    responseBody,
    requestBody,
  }: {
    message: string;
    status?: number;
    statusText?: string;
    method: string;
    url: string;
    responseBody?: unknown;
    requestBody?: unknown;
  }) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.statusText = statusText;
    this.method = method;
    this.url = url;
    this.responseBody = responseBody;
    this.requestBody = requestBody;
    this.timestamp = new Date();

    // This is necessary for proper instanceof checks in TypeScript
    Object.setPrototypeOf(this, APIError.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      method: this.method,
      url: this.url,
      timestamp: this.timestamp,
      responseBody: this.responseBody,
      requestBody: this.requestBody,
    };
  }
}

/** does not pparse arrays well */
export const parseSearchParams = (queryString: string) => {
  const parsed = qs.parse(queryString, {
    ignoreQueryPrefix: true,
  });

  // return parsed
  return {
    filters: parsed.filters,
    limit: Number(parsed.limit) || 10,
    offset: Number(parsed.offset) || 0,
    sortBy: (parsed.sortBy as string) || "created_at",
    sortOrder: (parsed.sortOrder as "desc" | "asc") || "desc",
    uid: parsed.uid,
  };
};

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    requestId?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}
