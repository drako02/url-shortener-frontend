import { NextRequest, NextResponse } from "next/server";
import {
  APIError,
  APIResponse,
  fetchRequest,
  mapToUser,
  URL_SERVICE_API_BASE_URL,
} from "../helpers";
import { FieldsToUpdate, User, UserResponse } from "../types";

export const PATCH = async (request: NextRequest) => {
  const { fields } = await request.json();
  const token = request.headers.get("token");
  // const idToken = await auth.currentUser?.getIdToken();
  if (!token) {
    return NextResponse.json<APIResponse<null>>(
      { success: false, errors: { token: ["Missing auth token"] } },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await update(fields, token);

    return NextResponse.json<APIResponse<User>>(
      { success: true, data: mapToUser(updatedUser)},
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json<APIResponse<null>>(
        { success: false, errors: { api: [error.message] } },
        { status: error.status }
      );
    }
    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        errors: { error: ["Internal Server"] },
      },
      { status: 500 }
    );
  }
};

const update = async (
  fields: FieldsToUpdate,
  idToken?: string
): Promise<UserResponse> => {
  const res = await fetchRequest<{ message: string; data: UserResponse }>(
    `${URL_SERVICE_API_BASE_URL}/user/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: { first_name: fields.firstName, last_name: fields.lastName },
    }
  );

  return res.data;
};
