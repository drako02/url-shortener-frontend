"use client";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  create_with_email_password,
  sign_in_email_password,
  signInUserWithGooglePopup,
  signUserOut,
} from "@/lib/services/auth";
import { addUser, getUser } from "@/api/users/add";
import { parseDisplayName } from "@/lib/helpers";
import { User, UserResponse } from "@/api/types";

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

const mapToUser = (backendUser: UserResponse): User => ({
  firstName: backendUser.first_name,
  lastName: backendUser.last_name,
  uid: backendUser.uid,
  email: backendUser.email,
  joinedAt: new Date(backendUser.joined_at),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [initializing, setInitializing] = useState<boolean>(true);

  const isAuthenticated = Boolean(user) && !initializing;
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(undefined);
        setInitializing(false);
        return;
      }
      console.log("herrrrrrrrrrrrrrrrre");
      getUser(firebaseUser?.uid)
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
  }, [auth]);

  const signIn = async (props: SignIn): Promise<string> => {
    setInitializing(true);
    try {
      const { option } = props;
      if (option === "email_password") {
        const { email, password } = props;
        const firebaseUser = await sign_in_email_password(email, password);
        const user  = await getUser(firebaseUser.uid)
        setUser(mapToUser(user))
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

          if (newUser) {
            setUser(mapToUser(newUser));
            return firebaseUser.uid;
          }
        } catch (error) {
          const existingUser = await getUser(firebaseUser.uid);
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
      setUser(mapToUser(user))
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
