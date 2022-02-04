/* eslint-disable no-underscore-dangle */

import Bottleneck from "bottleneck";
import Webflow, { WebflowApiModel } from "webflow-api";
import { closestMatch } from "closest-match";

import { IWfData } from "@project-xxx/types/src/Webflow";

import AppSecrets from "./AppSecrets";

const wfLimiter = new Bottleneck({ minTime: 1000 });

wfLimiter.on("failed", async (error, jobInfo): Promise<null | number> => {
  const queuedJobs = wfLimiter.jobs("QUEUED" as any);
  const runningJobs = wfLimiter.jobs("RUNNING" as any);
  const executingJobs = wfLimiter.jobs("EXECUTING" as any);

  const idxOfThisJob =
    (executingJobs.findIndex((id) => jobInfo.options.id === id) || 0) +
    runningJobs.length +
    queuedJobs.length;

  // Only retry if it's rate-limit error, and only up to 10 times
  if (error.code === 429 && jobInfo.retryCount < 10) {
    const msOfBackOff = 2 ** jobInfo.retryCount * 1000 + idxOfThisJob * 1000;
    return msOfBackOff;
  }

  // eslint-disable-next-line no-console
  console.log(error);

  return null;
});

interface IUpdateItemDTO {
  itemId: string;
  collectionId: string;
  live: boolean;
  fields: { [key: string]: any };
}

interface ICreateItemDTO {
  collectionId: string;
  fields: { [key: string]: any };
  live: boolean;
}

let COLLECTION_SCHEMA_CACHE: {
  [cId: string]: Promise<Webflow.WebflowApiModel.Collection> | undefined;
} = {};

let ALL_COLLECTION_ITEMS_CACHE: {
  [cId: string]: Promise<Webflow.WebflowApiModel.CollectionItem[]> | undefined;
} = {};

let ITEMS_CACHE: {
  [colAndItemId: string]: Promise<IWfData> | undefined;
} = {};

export default class WebflowAPI {
  public static BEST_ORDER_FOR_IMPORTS = [
    "themes-collection",
    "sub-themes-collection",
  ];

  private static api?: Webflow;

  private static async getApi() {
    if (!this.api) {
      const tokenInSecrets = await AppSecrets.get("WF_API-KEY");
      this.api = new Webflow({ token: tokenInSecrets || "" });
    }

    return this.api;
  }

  static invalidateCache() {
    COLLECTION_SCHEMA_CACHE = {};
    ALL_COLLECTION_ITEMS_CACHE = {};
    ITEMS_CACHE = {};
  }

  static collectionSortFunctionBasedOnBestImportOrder(
    a: WebflowApiModel.Collection,
    b: WebflowApiModel.Collection
  ) {
    const closestMatchToSlugA = closestMatch(
      a.slug,
      WebflowAPI.BEST_ORDER_FOR_IMPORTS
    );

    const closestMatchToSlugB = closestMatch(
      b.slug,
      WebflowAPI.BEST_ORDER_FOR_IMPORTS
    );

    return (
      WebflowAPI.BEST_ORDER_FOR_IMPORTS.indexOf(closestMatchToSlugA as string) -
      WebflowAPI.BEST_ORDER_FOR_IMPORTS.indexOf(closestMatchToSlugB as string)
    );
  }

  static async getAllWebsites() {
    const api = await this.getApi();
    return wfLimiter.schedule(() => api.sites());
  }

  static async getWebsiteData(siteId: string) {
    const api = await this.getApi();
    return wfLimiter.schedule(() => api.site({ siteId }));
  }

  static async createWebhook(
    siteId: string,
    triggerType: Webflow.WebflowApiModel.WebhookTriggerType,
    url: string
  ) {
    const api = await this.getApi();

    return wfLimiter.schedule(() =>
      api.createWebhook({ siteId, triggerType, url })
    );
  }

  static async getAllCollectionsOfWebsite(siteId: string) {
    const api = await this.getApi();

    // Result is not cached because it doesn't return collection schema
    const collections = await wfLimiter.schedule(() =>
      api.collections({ siteId })
    );

    collections.sort(
      this.collectionSortFunctionBasedOnBestImportOrder.bind(this)
    );

    return collections;
  }

  static async getCollection(collectionId: string) {
    if (!COLLECTION_SCHEMA_CACHE[collectionId]) {
      const api = await this.getApi();

      COLLECTION_SCHEMA_CACHE[collectionId] = wfLimiter.schedule(() =>
        api.collection({ collectionId })
      );
    }

    return COLLECTION_SCHEMA_CACHE[collectionId]!;
  }

  static async deleteAllItemsOfSite(pilotId: string) {
    const pilotCollections = await WebflowAPI.getAllCollectionsOfWebsite(
      pilotId
    );

    // eslint-disable-next-line no-restricted-syntax
    for await (const tc of pilotCollections.reverse()) {
      await WebflowAPI.deleteAllItemsOfCollection(tc._id);
    }
  }

  static async deleteAllItemsOfCollection(collectionId: string) {
    const items = await this.getAllItemsOfCollection(collectionId);

    return Promise.all(
      items.map((item) => this.deleteItem(collectionId, item._id))
    );
  }

  static async deleteItem(collectionId: string, itemId: string) {
    const api = await this.getApi();
    return wfLimiter.schedule(() => api.removeItem({ collectionId, itemId }));
  }

  static async getAllItemsOfCollection(
    collectionId: string,
    shouldFlatten = true
  ) {
    const api = await this.getApi();
    const MAX_PER_REQUEST = 100;

    const getItems = async (pageNo = 1) => {
      const res = await wfLimiter.schedule(() =>
        api.items(
          { collectionId },
          {
            limit: MAX_PER_REQUEST,
            offset: (pageNo - 1) * MAX_PER_REQUEST,
          }
        )
      );

      return res.items;
    };

    /**
     * @param pageNo Page Offset
     * @returns Array of all startups that belong to a given instance,
     * through the use of recursion over Webflow's pagination
     */
    const getAllItems = async (
      pageNo = 1
    ): Promise<Webflow.WebflowApiModel.CollectionItem[]> => {
      const results = await getItems(pageNo);

      // "If" passes if we think there are more items to be added
      // after pagination
      if (results.length === MAX_PER_REQUEST) {
        return results.concat(await getAllItems(pageNo + 1));
      }
      return results;
    };

    const cItemsCacheKey = collectionId;

    if (!ALL_COLLECTION_ITEMS_CACHE[cItemsCacheKey]) {
      ALL_COLLECTION_ITEMS_CACHE[cItemsCacheKey] = getAllItems();
    }

    const [items, collection] = await Promise.all([
      ALL_COLLECTION_ITEMS_CACHE[cItemsCacheKey]!,
      this.getCollection(collectionId),
    ]);

    const formattedItems = await Promise.all(
      items.map(async (i) => {
        const cacheKey = `${i._id}${shouldFlatten ? "-flat" : ""}`;

        if (!ITEMS_CACHE[cacheKey]) {
          ITEMS_CACHE[cacheKey] = this.normalizeItemData(
            collection,
            i,
            shouldFlatten
          );
        }

        return ITEMS_CACHE[cacheKey]!;
      })
    );

    return formattedItems;
  }

  static async getItem(
    collectionId: string,
    itemId: string,
    shouldFlatten = false,
    allowCachedResult = true
  ) {
    const cacheKey = `${itemId}${shouldFlatten ? "-flat" : ""}`;

    if (allowCachedResult && ITEMS_CACHE[cacheKey]) {
      return ITEMS_CACHE[cacheKey]!;
    }

    const api = await this.getApi();

    return wfLimiter.schedule(async () => {
      const [collection, collectionItem] = await Promise.all([
        this.getCollection(collectionId),
        api.item({ collectionId, itemId }),
      ]);

      ITEMS_CACHE[cacheKey] = this.normalizeItemData(
        collection,
        collectionItem,
        shouldFlatten
      );

      return ITEMS_CACHE[cacheKey]!;
    });
  }

  private static async normalizeItemData(
    collection: Pick<Webflow.WebflowApiModel.Collection, "fields" | "slug">,
    item: Webflow.WebflowApiModel.CollectionItem,
    shouldFlatten: boolean
  ): Promise<IWfData> {
    // See https://stackoverflow.com/a/208106/11865501 to understand the destructuring of the response
    const { update, remove, ...itemData } = item;

    await Promise.all(
      collection.fields.map(async (field) => {
        const fieldSlug = field.slug;
        const fieldVal = itemData[fieldSlug];

        if (!fieldVal || !shouldFlatten) return;
        if (field.type === "Option") {
          const selectedOption = field.validations.options?.find(
            (opt) => opt.id === fieldVal
          );
          itemData[fieldSlug] = selectedOption?.name || "";
        } else if (field.type === "ItemRef") {
          const refCol = field.validations.collectionId!;
          itemData[fieldSlug] = await this.getItem(refCol, fieldVal);
        } else if (field.type === "ItemRefSet") {
          const refCol = field.validations.collectionId!;
          itemData[fieldSlug] = await Promise.all(
            fieldVal.map((itemId: string) => this.getItem(refCol, itemId))
          );
        }
      })
    );

    return {
      ...itemData,
      _cSlug: collection.slug,
    };
  }

  /**
   * @summary Replaces all fields of an existent item with the fields specified in the payload.
   */
  static async updateItem(data: IUpdateItemDTO) {
    const api = await this.getApi();
    const itemData = { ...data, fields: { ...data.fields } };

    delete itemData.fields._id;
    delete itemData.fields.slug;
    delete itemData.fields["updated-on"];
    delete itemData.fields["updated-by"];
    delete itemData.fields["created-on"];
    delete itemData.fields["created-by"];
    delete itemData.fields["published-on"];
    delete itemData.fields["published-by"];

    const item = await wfLimiter.schedule(() =>
      api.patchItem(
        {
          collectionId: itemData.collectionId,
          itemId: itemData.itemId,
          fields: {
            ...itemData.fields,
          },
        },
        { live: itemData.live }
      )
    );

    return item;
  }

  static async createItem(req: ICreateItemDTO) {
    const api = await this.getApi();
    const itemData = { fields: { ...req.fields } };

    delete itemData.fields._id;
    // delete itemData.fields.slug;
    delete itemData.fields["updated-on"];
    delete itemData.fields["updated-by"];
    delete itemData.fields["created-on"];
    delete itemData.fields["created-by"];
    delete itemData.fields["published-on"];
    delete itemData.fields["published-by"];

    const item = await wfLimiter.schedule(() =>
      api.createItem(
        {
          collectionId: req.collectionId,
          fields: itemData.fields,
        },
        { live: req.live }
      )
    );

    return item;
  }

  static async publishSite(siteId: string, domains: string[]) {
    const api = await this.getApi();
    return wfLimiter.schedule(() => api.publishSite({ siteId, domains }));
  }
}
