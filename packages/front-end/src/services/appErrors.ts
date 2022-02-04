export default class AppErrors {
  static getErrorLabelFromError(error: unknown) {
    return error instanceof Error ? error.message : 'UNKNOWN';
  }
}
