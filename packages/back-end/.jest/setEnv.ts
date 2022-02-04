import * as admin from "firebase-admin";
import devServiceAccount from "../dev-service-account.json";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./dev-service-account.json";
process.env.NODE_ENV = "development";

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: devServiceAccount.project_id,
    credential: admin.credential.cert({
      projectId: devServiceAccount.project_id,
      privateKey: devServiceAccount.private_key,
      clientEmail: devServiceAccount.client_email,
    }),
  });
}
