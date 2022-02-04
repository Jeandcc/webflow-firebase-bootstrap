/* eslint-disable no-underscore-dangle */

import WebflowAPI, { WebflowApiModel } from "webflow-api";

import AppSecrets from "./AppSecrets";
import Webflow from "./Webflow";

type TWfItem = WebflowApiModel.CollectionItem;

describe("webflow", () => {
  const TEST_SITE_NAME = "DEV - Backend Tests Target";
  const TEST_SITE_ID = "6180476512a8f7ed3fdde199";
  const TEST_COLLECTION_ID = "6180476512a8f77717dde25c";
  const TEST_ITEM_ID = "6180476512a8f71e00dde319";

  it("successfully gets all the websites under account", async () => {
    const sites = await Webflow.getAllWebsites();
    expect(sites.length).toBeGreaterThan(0);
  });

  it("successfully backs-off and retries in case we go over the rate-limit", async () => {
    const wfApiToken = (await AppSecrets.get("WF_API-KEY")) || "";
    const rateLimitedApi = Webflow;
    const nonRateLimitedApi = new WebflowAPI({ token: wfApiToken });

    // 59 = Max number of requests we can make in a minute - 1
    for (let i = 0; i < 59; i += 1) {
      // We don't care if they fail, they are only meant to hit the API
      nonRateLimitedApi.sites().catch(() => {});
    }

    const rateLimitedResponses = await Promise.all([
      rateLimitedApi.getAllWebsites(),
      rateLimitedApi.getAllWebsites(),
      rateLimitedApi.getAllWebsites(),
      rateLimitedApi.getAllWebsites(),
      rateLimitedApi.getAllWebsites(),
    ]);

    const allRateLimitedResponsesWereSuccessful = rateLimitedResponses.every(
      (sitesArray) => sitesArray.length > 0
    );

    expect(allRateLimitedResponsesWereSuccessful).toBe(true);
  }, 120000);

  it("successfully gets data specific to a given website", async () => {
    const site = await Webflow.getWebsiteData(TEST_SITE_ID);
    expect(site.name).toBe(TEST_SITE_NAME);
  });

  it("successfully gets all collections of website", async () => {
    const collections = await Webflow.getAllCollectionsOfWebsite(TEST_SITE_ID);
    expect(collections.length).toBeGreaterThan(0);
  });

  it("successfully gets collection data", async () => {
    const data = await Webflow.getCollection(TEST_COLLECTION_ID);
    expect(data._id).toBe(TEST_COLLECTION_ID);
  });

  it("successfully gets cached collection data", async () => {
    const data = await Webflow.getCollection(TEST_COLLECTION_ID);
    expect(data._id).toBe(TEST_COLLECTION_ID);

    const cacheTimeout = setTimeout(() => {
      throw new Error("Fetching from cache took too long");
    }, 100);

    const cachedData = await Webflow.getCollection(TEST_COLLECTION_ID);
    clearTimeout(cacheTimeout);
    expect(cachedData._id).toBe(TEST_COLLECTION_ID);
  });

  it("successfully gets all items of a collection of website", async () => {
    const items = await Webflow.getAllItemsOfCollection(TEST_COLLECTION_ID);
    expect(items.length).toBeGreaterThan(0);
  }, 30000);

  it("successfully gets item data", async () => {
    const data = await Webflow.getItem(TEST_COLLECTION_ID, TEST_ITEM_ID);
    expect(data._id).toBe(TEST_ITEM_ID);
  });

  it("successfully normalizes item data", async () => {
    const data = await Webflow.getItem(TEST_COLLECTION_ID, TEST_ITEM_ID, true);

    const normalizedRefData: TWfItem = data.theme;
    const normalizedMultiRefData: TWfItem[] = data["glossary-tags"];

    const didNormalizeRef = normalizedRefData.name === "Test Theme";
    const didNormalizeMultiRef = normalizedMultiRefData.find(
      (i) => i.name === "Test Tag 1"
    );

    expect(didNormalizeRef).toBeTruthy();
    expect(didNormalizeMultiRef).toBeTruthy();
  }, 20000);

  it("successfully gets cached item data", async () => {
    const data = await Webflow.getItem(TEST_COLLECTION_ID, TEST_ITEM_ID);
    expect(data._id).toBe(TEST_ITEM_ID);

    const cacheTimeout = setTimeout(() => {
      throw new Error("Fetching from cache took too long");
    }, 100);

    const cachedData = await Webflow.getItem(TEST_COLLECTION_ID, TEST_ITEM_ID);
    clearTimeout(cacheTimeout);
    expect(cachedData._id).toBe(TEST_ITEM_ID);
  }, 10000);

  it("successfully updates an item of website", async () => {
    const newRandStr = Math.random().toString().substr(0, 7);

    await Webflow.updateItem({
      collectionId: TEST_COLLECTION_ID,
      itemId: TEST_ITEM_ID,
      fields: { name: newRandStr },
      live: true,
    });

    const updatedItem = await Webflow.getItem(
      TEST_COLLECTION_ID,
      TEST_ITEM_ID,
      false,
      false
    );

    expect(updatedItem.name).toBe(newRandStr);
  }, 10000);
});
