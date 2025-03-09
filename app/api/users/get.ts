import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { UserResponse } from "../types";
import { cookies } from "next/headers";
    // Function to get cookie by name
    export const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return undefined;
      };

export const getUserFromCookies = (cookies: ReadonlyRequestCookies) => {
    const userDataCookie = cookies.get("userData")?.value;

    // const userDataCookie = getCookie("userData", document);
    if(!userDataCookie){
        return
        // throw new Error("No userdata found in cookies")
    }
    const userData = JSON.parse(userDataCookie) as UserResponse
    console.log("User data from httpOnly cookies: ", userData)
    
    return userData;
} 