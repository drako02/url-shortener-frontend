import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth } from "@/firebaseConfig";

const provider = new GoogleAuthProvider();

export const create_with_email_password = async (email: string, password: string) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredentials.user;
    return user;
  } catch (error) {
    console.error("Failed to create user:, ", error);
    throw error;
  }
};

export const sign_in_email_password = async (email: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;
    return user;
  } catch (error) {
    console.error("Failed to sign in user:, ", error);
    throw error;
  }
};

export const signInUserWithGooglePopup = async () => {
  try {
    const userCredentials = await signInWithPopup(auth, provider);
    return userCredentials.user;
  } catch (error) {
    console.error("Failed to sign user in with google popup:, ", error);
    throw error;
  }
};

export const signUserOut = async() => {
  try{
    await signOut(auth);
  } catch(error){
    console.error("Failed to sign user out:, ", error);
    throw error;
  }
}

