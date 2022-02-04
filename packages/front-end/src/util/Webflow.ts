import { debounce } from 'debounce';

export default class WebflowUtils {
  private static ixRestartWillHappen = false;

  private static actions: Function[] = [];

  private static restartIX2Debounced = debounce(() => {
    const { Webflow } = window;

    Webflow?.destroy();
    Webflow?.ready();
    Webflow?.require('ix2').init();
    document.dispatchEvent(new Event('readystatechange'));

    WebflowUtils.executeFunctions();
    WebflowUtils.ixRestartWillHappen = false;
  }, 750);

  private static executeFunctions() {
    this.actions.forEach(fn => fn());
    this.actions = [];
  }

  public static restartTabsImmediately() {
    const WTabs = window.Webflow?.require('tabs');
    WTabs?.destroy();
    WTabs?.ready();
  }

  public static restartIX2() {
    this.ixRestartWillHappen = true;
    this.restartIX2Debounced();
  }

  public static pushActions(...fnArgs: Function[]) {
    this.actions.push(...fnArgs);
    if (!this.ixRestartWillHappen) this.executeFunctions();
  }
}
