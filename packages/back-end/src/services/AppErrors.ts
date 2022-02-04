import * as functions from "firebase-functions";
import { FunctionsErrorCode } from "firebase-functions/v1/https";

import ErrorReportingService from "./ErrorReporting";

export type TApplicationError =
  | "AUTH/NOT-LOGGED-IN"
  | "AUTH/UNAUTHORIZED"
  | "REQUEST/MALFORMED";

const mapOfErrors: { [K in TApplicationError]: FunctionsErrorCode } = {
  "AUTH/NOT-LOGGED-IN": "unauthenticated",
  "AUTH/UNAUTHORIZED": "permission-denied",
  "REQUEST/MALFORMED": "invalid-argument",
};

export default function AppError(
  error: TApplicationError,
  details?: unknown | Error
) {
  let errorName: string = error;
  const errorCategory = mapOfErrors[error];

  if (details instanceof Error) {
    errorName = details.name;
  }

  if (errorCategory === "internal") {
    ErrorReportingService.report(error, details);
  }

  return new functions.https.HttpsError(errorCategory, errorName, details);
}
