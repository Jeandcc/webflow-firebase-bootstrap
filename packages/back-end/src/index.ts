/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */

import * as admin from "firebase-admin";
if (admin.apps.length === 0) admin.initializeApp();

import auth from "@/api/auth";

export { auth };
export default { auth };
