"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  create_with_email_password,
  sign_in_email_password,
  signInUserWithGooglePopup,
} from "@/lib/services/auth";

type SignIn =
  | {
      option: "email_password";
      email: string;
      password: string;
    }
  | { option: "google" };

type AuthContextProps = {
  user: User | undefined;
  signIn: (props: SignIn) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  authenticating: boolean;
};

export const AuthContext = React.createContext<AuthContextProps>({
  user: undefined,
  signIn: async () => undefined,
  createAccount: async () => undefined,
  authenticating: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || undefined);
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (props: SignIn) => {
    try {
      const { option } = props;
      setAuthenticating(true);
      if (option === "email_password") {
        const { email, password } = props;

        await sign_in_email_password(email, password);
      } else {
        await signInUserWithGooglePopup();
      }
    } catch (error) {
      console.error(error);
      //do something
    } finally {
      setAuthenticating(false);
    }
  };

  const createAccount = async (email: string, password: string) => {
    try {
      setAuthenticating(true);
      await create_with_email_password(email, password);
    } catch (error) {
      console.error("Account creation error:", error);
      //do something
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, createAccount, authenticating }}
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
