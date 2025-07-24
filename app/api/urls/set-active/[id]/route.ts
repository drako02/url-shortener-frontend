import { NextRequest, NextResponse } from "next/server";
import {
  APIError,
  APIResponse,
  fetchRequest,
  URL_SERVICE_API_BASE_URL,
} from "../../../helpers";

export async function PUT(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json<APIResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {id} = params;
    const statusParam = request.nextUrl.searchParams.get("status");

    if ( !statusParam) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          message: "Missing or invalid `id` or `status` parameter",
        },
        { status: 400 }
      );
    }

    const active = statusParam === "true";


    const res = await fetchRequest(`${URL_SERVICE_API_BASE_URL}/urls/set-active`, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: { id: Number(id), value: active },
    });
    return NextResponse.json<APIResponse<null>>(
      { success: true , message: res?.message},
      { status: 200 }
    );
    
  } catch (error) {
    // logError({
    //   context: "Setting URL active status",
    //   error,
    //   message: "Failed to set URL active status",
    //   logLevel: "error",
    // })

    if (error instanceof APIError) {
      console.log("next router error", error.status)

      return NextResponse.json<APIResponse<null>>(
        { success: false, message: error.message },
        { status: error.status }
      );
    }


    return NextResponse.json<APIResponse<null>>(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
