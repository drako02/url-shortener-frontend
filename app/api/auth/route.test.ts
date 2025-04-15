import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
import { POST } from "./route";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

jest.mock("next/server", () => {
  return {
    NextRequest: jest.fn(),
    NextResponse: {
      json: jest.fn((body, options) => ({ body, options })),
    },
  };
});

jest.mock("next/headers", () => {
  return {
    cookies: jest.fn(() => ({
      set: jest.fn(),
      delete: jest.fn(),
    })),
  };
});

describe("Auth API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe("POST handler", () => {
    test("should return 400 if request body is empty", async () => {
      const req = { body: null } as unknown as NextRequest;
      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Request body is empty" },
        { status: 400 }
      );
    });

    // test("should")
  });
});
