import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import serviceAccountJSON from "./.cred/url-shortner-784fc-firebase-adminsdk-fbsvc-c7b0277b29.json";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : serviceAccountJSON;

if (!serviceAccount) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
}

const adminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
    : getApps()[0];

const adminAuth = getAuth(adminApp);

export { adminAuth };
