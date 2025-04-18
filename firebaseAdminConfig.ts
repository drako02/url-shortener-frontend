import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import serviceAccount from "./.cred/url-shortner-784fc-firebase-adminsdk-fbsvc-c7b0277b29.json";
import {getAuth} from "firebase-admin/auth"

const adminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
    : getApps()[0];


const adminAuth = getAuth(adminApp)

export {adminAuth}

