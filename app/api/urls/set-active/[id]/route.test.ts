import { NextRequest, NextResponse } from "next/server";
import { APIResponse, fetchRequest, URL_SERVICE_API_BASE_URL } from "../../../helpers";
import { PUT } from "./route";

jest.mock("next/server", () => {
  return { NextRequest: jest.fn(), NextResponse: { json: jest.fn() } };
});

jest.mock("../../../helpers", () => {
  return { fetchRequest: jest.fn() };
});

const defaultMockRequest = {
  headers: {
    get: jest.fn().mockImplementation((header) => {
        if (header === "Authorization") return "test-token";
      }),
  },
  nextUrl: {
    searchParams: {
      get: jest.fn(),
    },
  },
};

describe("PUT handler", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should get token from request", async () => {
    const mockRequest = {
      ...defaultMockRequest,
      headers: {
        get: jest.fn().mockImplementation((header) => {
          if (header === "Authorization") return "test-token";
        }),
      },
    };

    await PUT(mockRequest as unknown as NextRequest);

    expect(mockRequest.headers.get).toHaveBeenCalledWith("Authorization");
    expect(mockRequest.headers.get).toHaveReturnedWith("test-token");
  });

  test("should return status unauthorized(401) if no token", async () => {
    const mockRequest = {
      ...defaultMockRequest,
      headers: new Headers(),
    } as unknown as NextRequest;

    const unauthorizedErrorBody: APIResponse<null> = {
      success: false,
      message: "Unauthorized",
    };

    await PUT(mockRequest);
    expect(NextResponse.json).toHaveBeenCalledWith(unauthorizedErrorBody, {
      status: 401,
    });
  });

  test("should get url id and active value from request", async () => {
    const mockRequest = {
      ...defaultMockRequest,

      nextUrl: {
        searchParams: {
          get: jest
            .fn()
            .mockImplementation((key: string) =>
              key === "status" ? true : null
            ),
        },
        pathname: "123",
      },
    } as unknown as NextRequest;

    await PUT(mockRequest);
    expect(mockRequest.nextUrl.pathname).toBe("123");
    expect(mockRequest.nextUrl.searchParams.get).toHaveBeenCalled();
    expect(mockRequest.nextUrl.searchParams.get).toHaveBeenCalledWith("status");
  });

  test("should make request successfully", async () => {
    const mockRequest = {
      ...defaultMockRequest,
      headers: {
        get: jest.fn().mockImplementation((header) => {
          if (header === "Authorization") return "test-token";
        }),
      },
      //   json: jest.fn().mockResolvedValue({ id: 123, value: true }),
      nextUrl: {
        pathname: "123",
        searchParams: { get: jest.fn().mockImplementation((v) => v && true) },
      },
    } as unknown as NextRequest;

    jest.mocked(fetchRequest).mockImplementation();
    await PUT(mockRequest);

    const requestSecondArg = {
      method: "PUT",
      headers: {
        Authorization: "test-token",
      },
      body: { id: 123, value: true },
    };

    expect(fetchRequest).toHaveBeenCalled();
    expect(fetchRequest).toHaveBeenCalledWith(
      `${URL_SERVICE_API_BASE_URL}/urls/set-active`,
      requestSecondArg
    );
  });
});

