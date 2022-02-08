/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */

import * as admin from "firebase-admin";
if (admin.apps.length === 0) admin.initializeApp();

import auth from "@api/auth";

// eslint-disable-next-line import/prefer-default-export
export { auth };
