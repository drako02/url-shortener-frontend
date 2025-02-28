"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  create_with_email_password,
  sign_in_email_password,
  signInUserWithGooglePopup,
  signUserOut,
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
  signIn: (props: SignIn) => Promise<User | undefined>;
  createAccount: (email: string, password: string) => Promise<User | undefined>;
  authenticating: boolean;
  signOut: () => Promise<void>
};

export const AuthContext = React.createContext<AuthContextProps>({
  user: undefined,
  signIn: async () => undefined,
  createAccount: async () => undefined,
  authenticating: false,
  signOut: async () => undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [authenticating, setAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || undefined);
      setAuthenticating(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (props: SignIn): Promise<User> => {
    try {
      const { option } = props;
      setAuthenticating(true);
      if (option === "email_password") {
        const { email, password } = props;

        return sign_in_email_password(email, password);

      } else {
        return signInUserWithGooglePopup();
      }
    } catch (error) {
      console.error(error);
      throw error
      //do something
    } finally {
      setAuthenticating(false);
    }
  };

  const createAccount = async (email: string, password: string):Promise<User> => {
    try {
      setAuthenticating(true);
      return create_with_email_password(email, password);
    } catch (error) {
      console.error("Account creation error:", error);
      throw error
      //do something
    } finally {
      setAuthenticating(false);
    }
  };

  const signOut = async () => {
    await signUserOut();
  }
  return (
    <AuthContext.Provider
      value={{ user, signIn, createAccount, authenticating, signOut }}
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
