import webdriver, { By, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { path } from 'chromedriver';

import ArrayUtils from '../src/util/Array';

export default class SeleniumTestUtils {
  private static driver: webdriver.ThenableWebDriver;

  static BASE_URL = 'https://dev-firebase-headless.webflow.io/';

  static getDriver(): webdriver.ThenableWebDriver {
    if (this.driver) return this.driver;

    const service = new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);

    this.driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    return this.driver;
  }

  static async clearBrowserData() {
    const cy = SeleniumTestUtils.getDriver();

    await cy.manage().deleteAllCookies();
    await cy.executeScript('window.localStorage.clear();');
    await cy.executeScript(
      'indexedDB.deleteDatabase("firebaseLocalStorageDb")',
    );
  }

  static async sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(() => resolve(undefined), ms);
    });
  }

  static findEl(selector: string) {
    return SeleniumTestUtils.getDriver().findElement(By.css(selector));
  }

  static findElWithText(text: string) {
    return SeleniumTestUtils.getDriver().findElement(
      By.xpath(`//*[text()[contains(.,'${text}')]]`),
    );
  }

  static findEls(selector: string) {
    return SeleniumTestUtils.getDriver().findElements(By.css(selector));
  }

  static async scrollToElement(el: WebElement) {
    const cy = SeleniumTestUtils.getDriver();
    await cy.executeScript('arguments[0].scrollIntoView(true);', el);
  }

  static async getValueOfLatestGAAction(eventAction: string) {
    const traffic = await this.getLatestNetworkTraffic();

    const indexOfTarget = ArrayUtils.findLastIndex(traffic, entry => {
      const decodedName = decodeURI(entry.name);
      if (!decodedName.includes('http')) return false;

      const decodedURL = new URL(decodedName);
      return decodedURL.searchParams.get('ea') === eventAction;
    });

    if (indexOfTarget < 0) throw new Error("Couldn't find event");

    const decodedURL = new URL(decodeURI(traffic[indexOfTarget].name));
    return parseFloat(decodedURL.searchParams.get('ev') || '');
  }

  private static async getLatestNetworkTraffic() {
    const network: PerformanceEntryList = await this.getDriver().executeScript(
      `var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; return performance.getEntries() || {};`,
    );

    return network;
  }
}
