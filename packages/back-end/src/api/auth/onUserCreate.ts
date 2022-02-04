import * as functions from "firebase-functions";

import { FireAuth } from "@services/firebase";
import ErrorReportingService from "@services/ErrorReporting";

export default functions.auth.user().onCreate(async (user) => {
  if (!user.email || !user.emailVerified) {
    if (!user.email) {
      ErrorReportingService.report(
        `User without email detected. Deleting: ${user.toJSON()}`
      );
    } else if (!user.emailVerified) {
      ErrorReportingService.report(
        `User without verified email detected. Deleting: ${user.toJSON()}`
      );
    }

    await FireAuth.deleteUser(user.uid);
  }
});
