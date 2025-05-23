/**
 * @jest-environment jsdom
 */

import { deleteUrl } from "./helpers";
import { fetchRequest } from "@/app/api/helpers";
import { auth } from "@/firebaseConfig";
// auth.currentUser?.getIdToken();

jest.mock("../../app/api/helpers", () => {
  return {
    fetchRequest: jest.fn(),
    logError: jest.fn()
  };
});

const mockUserState: { currentUser: unknown | null } = {
  currentUser: { getIdToken: jest.fn().mockResolvedValue("test-token") },
};

jest.mock("@/firebaseConfig", () => {
  return {
    auth: {
      get currentUser() {
        return mockUserState.currentUser;
      },
    },
  };
});

const mockedFetch = jest.mocked(fetchRequest);
const mockedGetIdToken = jest.mocked(auth.currentUser?.getIdToken);
// const mockedGetIdToken = jest.mocked(auth.currentUser?.getIdToken)

describe("deleteUrl", () => {
  test("should deleteUrl successfully", async () => {
    mockedFetch.mockClear();

    mockedFetch.mockResolvedValue({ id: 123, longUrl: "https://example.com" });

    const res = await deleteUrl(123);

    expect(fetchRequest).toHaveBeenCalledWith("/api/urls/", {
      method: "DELETE",
      headers: { Authorization: `Bearer test-token` },
      body: { id: 123 },
    });

    expect(await auth.currentUser?.getIdToken()).toBe("test-token");

    // expect(res.success).toBe(true);
    expect(res).toStrictEqual({
      success: true,
      data: { id: 123, longUrl: "https://example.com" },
      error: null,
    });
  });

  test("should return correct object when the API call fails", async () => {
    mockedFetch.mockClear();

    mockedFetch.mockRejectedValue(new Error("Failed to delete url"));

    const res = await deleteUrl(123);

    expect(fetchRequest).toHaveBeenCalledWith("/api/urls/", {
      method: "DELETE",
      headers: { Authorization: `Bearer test-token` },
      body: { id: 123 },
    });

    expect(res).toStrictEqual({
      success: false,
      data: null,
      error: new Error("Failed to delete url"),
    });
  });

  test("should handle token failure", async () => {
    mockedFetch.mockClear();
    mockedGetIdToken?.mockRejectedValue(new Error("failed to get id token"));
    const res = await deleteUrl(123);

    expect(fetchRequest).not.toHaveBeenCalled();
    expect(res).toStrictEqual({
      success: false,
      data: null,
      error: new Error("failed to get id token"),
    });
  });

  test("should not call when there's no user", async () => {
    mockedFetch.mockClear();

    const originalUserState = mockUserState.currentUser;
    mockedFetch.mockClear();
    mockUserState.currentUser = null;

    const res = await deleteUrl(123);

    expect(fetchRequest).not.toHaveBeenCalled();
    expect(res).toStrictEqual({
      success: false,
      data: null,
      error: expect.any(Error),
    });

    // Restore for other tests
    mockUserState.currentUser = originalUserState;
  });
});
