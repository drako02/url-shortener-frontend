// "use client"
// import { mapToUser } from "@/app/api/helpers";
// import { User } from "@/app/api/types";
// import { getUserFromCookies } from "@/app/api/users/get";
// import React, { createContext, useState } from "react";

// type UserContextType = {
//   user: User | undefined;
//   setUser: React.Dispatch<React.SetStateAction<User | undefined>>;

// };
// export const UserContext = createContext<UserContextType>({
//   user: undefined,
//   setUser: () => {}
// });
// export const UserProvider = ({
//   children,
//   initialUser,
// }: {
//   children: React.ReactNode;
//   initialUser?: User;
// }) => {
//     const [user, setUser] = useState<User | undefined>(initialUser);

// //   const user = mapToUser(getUserFromCookies());
//   return (
//     <UserContext.Provider value={{ user, setUser }}> {children}</UserContext.Provider>
//   );
// };
