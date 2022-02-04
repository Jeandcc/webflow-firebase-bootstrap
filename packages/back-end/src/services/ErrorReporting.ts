import { ErrorReporting } from "@google-cloud/error-reporting";

export default class ErrorReportingService {
  private static client?: ErrorReporting;

  public static report(error: string, details?: string | object | unknown) {
    const undef = undefined;

    return new Promise((resolve) => {
      if (!this.client) {
        // mode="always" guarantees that the errors are sent even in development
        this.client = new ErrorReporting({ reportMode: "always" });
      }

      if (details) {
        const detailsStr =
          details instanceof Object ? JSON.stringify(details) : details;

        this.client.report(`${error}: ${detailsStr}`, undef, undef, resolve);
      } else {
        this.client.report(error, undef, undef, resolve);
      }
    });
  }
}
