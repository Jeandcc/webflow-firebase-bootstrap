export default class URLUtils {
  public static pushState(newUrl: string, shouldSendEventToWindow = false) {
    window.history.pushState(null, '', newUrl);

    if (shouldSendEventToWindow) {
      window.dispatchEvent(new Event('pushstate'));
    }
  }
}
