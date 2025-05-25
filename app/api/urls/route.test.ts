import { NextRequest, NextResponse } from "next/server";
import { fetchRequest, URL_SERVICE_API_BASE_URL } from "../helpers";
import { DELETE } from "./route";

jest.mock("../helpers", () => {
  return {
    // ...originalHelpers,
    fetchRequest: jest.fn(),
    URL_SERVICE_API_BASE_URL: "http://test-api",
    logError: jest.fn(),
  };
});

jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server");
  const mockNextResponseJson = jest
    .fn()
    .mockImplementation((data, options) => ({
      data,
      ...options,
    }));

  return {
    ...originalModule,
    NextResponse: {
      json: mockNextResponseJson,
    },
  };
});

describe("DELETE /api/urls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a URL using correct method and parameters", async () => {
    const mockfetchRequestResponse = { success: true };
    (fetchRequest as jest.Mock).mockResolvedValue(mockfetchRequestResponse);
    // (NextResponse.json as jest.Mock).mockReturnValue({data: mockfetchRequestResponse, status: 200})

    const mockRequest = {
      headers: {
        get: jest.fn().mockImplementation((header) => {
          if (header === "Authorization") return "Bearer test-token";
        }),
      },
      json: jest.fn().mockResolvedValue({ id: 123 }),
    };

    await DELETE(mockRequest as unknown as NextRequest);

    expect(mockRequest.headers.get).toHaveBeenCalledWith("Authorization");
    expect(mockRequest.json).toHaveBeenCalled();

    expect(fetchRequest).toHaveBeenCalledWith(
      `${URL_SERVICE_API_BASE_URL}/urls`,
      {
        method: "DELETE",
        body: { id: 123 },
        headers: {
          Authorization: `Bearer test-token`,
        },
      }
    );

    expect(NextResponse.json).toHaveBeenCalledWith(mockfetchRequestResponse, {
      status: 200,
    });
  });
});
