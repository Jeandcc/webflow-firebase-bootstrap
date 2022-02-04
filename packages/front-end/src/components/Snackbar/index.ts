import { MDCSnackbar } from '@material/snackbar';
import './style.scss';

const snackbarWrapperEl = $(`
<aside class="mdc-snackbar">
  <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
    <div class="mdc-snackbar__label" aria-atomic="false">
      Can't send photo. Retry in 5 seconds.
    </div>
    <div class="mdc-snackbar__actions" aria-atomic="true">
      <button type="button" class="mdc-button mdc-snackbar__action">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Retry</span>
      </button>
    </div>
  </div>
</aside>
`).appendTo('body');

export default class Snackbar {
  private static snackbar = new MDCSnackbar(snackbarWrapperEl[0]);

  public static notify(
    text: string,
    type: 'success' | 'danger' = 'success',
    callback?: Function,
  ) {
    const timeRequiredForReading = (text.split(' ').length / 4) * 1000;

    // Max: 10s - Min: 4s
    this.snackbar.timeoutMs = Math.min(
      Math.max(timeRequiredForReading + 3000, 4000),
      10000,
    );

    if (type === 'danger') this.snackbar.root.classList.add('cc-danger');
    else this.snackbar.root.classList.remove('cc-danger');

    this.snackbar.labelText = text;
    this.snackbar.actionButtonText = '';
    this.snackbar.open();

    if (callback) setTimeout(() => callback(), timeRequiredForReading);
  }

  public static close() {
    this.snackbar.close();
  }

  public static notifyOfError(error: unknown, callback?: Function) {
    Snackbar.notify(this.decodeError(error), 'danger', callback);
  }

  private static decodeError(error: unknown): string {
    if (error instanceof Error) {
      let errorTranslation: string | null = null;

      // Firebase throws 'internal' error when internet connection is
      // not available
      if (error.message === 'internal' && !navigator.onLine) {
        errorTranslation = 'NO-INTERNET';
      } else {
        errorTranslation = error.message;
      }

      return errorTranslation || error.message;
    }

    // eslint-disable-next-line no-console
    console.error(error);
    return 'Unknown error! Please, let us know about this occurrence!';
  }
}
