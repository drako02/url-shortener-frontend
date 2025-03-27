"use client";
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  create_with_email_password,
  sign_in_email_password,
  signInUserWithGooglePopup,
  signUserOut,
} from "@/lib/services/auth";
import { addUser, getUser } from "@/app/api/users/add";
import { parseDisplayName } from "@/lib/helpers";
import { User } from "@/app/api/types";
// import { getCookie } from "@/app/api/users/get";
import { mapToUser } from "@/app/api/helpers";
import { UserContext } from "./User";

type SignIn =
  | {
      option: "email_password";
      email: string;
      password: string;
    }
  | { option: "google" };

type AuthContextProps = {
  user: User | undefined;
  signIn: (props: SignIn) => Promise<string | undefined>;
  createAccount: (
    email: string,
    password: string
  ) => Promise<string | undefined>;
  initializing: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = React.createContext<AuthContextProps>({
  user: undefined,
  signIn: async () => undefined,
  createAccount: async () => undefined,
  initializing: false,
  signOut: async () => undefined,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userFromProvider } = useContext(UserContext);

  // console.log("AuthProvider user first time: ", userFromProvider)

  const [user, setUser] = useState<User | undefined>(userFromProvider);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [checkedCookies, setCheckedCookies] = useState(false);

  const isAuthenticated = Boolean(user) && !initializing;

  console.log(JSON.stringify(user));
  useEffect(() => {
    if (user) {
      console.log("Returned because user already exists");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setInitializing(true);
      console.log("Auth state firebase user: ", firebaseUser);
      if (!firebaseUser) {
        setUser(undefined);
        setInitializing(false);
        return;
      }

      const idToken = await firebaseUser.getIdToken();
      getUser(firebaseUser?.uid, idToken)
        .then((res) => {
          console.log("GET USER RESPONSE", JSON.stringify(res));
          setUser(mapToUser(res));
        })
        .catch((e) => {
          throw e;
        })
        .finally(() => {
          setInitializing(false);
        });
    });

    return () => unsubscribe();
  }, [checkedCookies, user]);

  const signIn = async (props: SignIn): Promise<string> => {
    setInitializing(true);
    try {
      const { option } = props;
      if (option === "email_password") {
        const { email, password } = props;
        const firebaseUser = await sign_in_email_password(email, password);

        const idToken = await firebaseUser.getIdToken(true);
        console.log("TTTTOOOOKKKKEEENNN: ", idToken)
        await saveTokenAndUid(firebaseUser.uid, idToken);
        const user = await getUser(firebaseUser.uid, idToken);
        setUser(mapToUser(user));
        return firebaseUser.uid;
      } else {
        const firebaseUser = await signInUserWithGooglePopup();
        const { firstName, lastName } = parseDisplayName(
          firebaseUser.displayName
        );
        try {
          const newUser = await addUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            first_name: firstName,
            last_name: lastName,
          });

          const idToken = await firebaseUser.getIdToken();
          if (newUser) {
            setUser(mapToUser(newUser));
            await saveTokenAndUid(firebaseUser.uid, idToken);
            return firebaseUser.uid;
          }
        } catch (error) {
          const idToken = await firebaseUser.getIdToken();

          const existingUser = await getUser(firebaseUser.uid, idToken);
          await saveTokenAndUid(firebaseUser.uid, idToken);

          setUser(mapToUser(existingUser));
          return firebaseUser.uid;
        }

        // }
        return firebaseUser.uid;
      }
    } catch (error) {
      console.error(error);
      throw error;
      //do something
    } finally {
      setInitializing(false);
    }
  };

  const createAccount = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      setInitializing(true);
      const firebaseUser = await create_with_email_password(email, password);
      const user = await addUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
      });
      setUser(mapToUser(user));
      const idToken = await firebaseUser.getIdToken();
      await saveTokenAndUid(firebaseUser.uid, idToken);
      return firebaseUser.uid;
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
      //do something
    } finally {
      setInitializing(false);
    }
  };

  const signOut = async () => {
    // document
    await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include",
    });
    localStorage.removeItem("recentUrls")
    await signUserOut();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        createAccount,
        initializing: initializing,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const saveTokenAndUid = async (uid: string, token: string) => {
  try {
    console.log("firebasetoken: ",{uid, token})
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token, uid }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Authentication failed: ${errorData.message || res.statusText}`
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save data on server", { cause: error });
  }
};
