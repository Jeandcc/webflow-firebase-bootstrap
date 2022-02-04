/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

import { closestMatch, distance as getMatchDistance } from "closest-match";

// This method will only be called during local development.
// eslint-disable-next-line import/no-extraneous-dependencies
import cliSelect from "cli-select";

interface IFieldForMapping {
  slug: string;
  name: string;
  type: string;
}

interface IMappingOfOriginAndTargetSlugs {
  [originSlug: string]: string | undefined;
}

export default class StringUtils {
  private static mappingDecisionCache: Record<string, string> = {};

  public static removeSubString(
    string: string,
    start: number,
    length: number
  ): string {
    return string.slice(0, start) + string.slice(start + length);
  }

  public static addSubString(
    string: string,
    index: number,
    stringToAdd: string
  ): string {
    return `${string.slice(0, index)}${stringToAdd}${string.slice(index)}`;
  }

  public static unslugify(slug: string): string {
    const result = slug.replace(/-/g, " ");
    return result.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  public static async generateMappingOfFields(
    originFields: IFieldForMapping[],
    targetFields: IFieldForMapping[],
    cacheKeyPrefix?: string
  ): Promise<IMappingOfOriginAndTargetSlugs> {
    const mappings: IMappingOfOriginAndTargetSlugs = {};
    const usedFieldTypes: Set<string> = new Set();

    originFields.forEach((field) => {
      usedFieldTypes.add(field.type);
    });

    for await (const fieldType of usedFieldTypes) {
      const usedOriginSlugs: Set<string> = new Set();
      const usedTargetSlugs: Set<string> = new Set();

      let unmappedOriginFields: IFieldForMapping[] = [...originFields];
      let unmappedTargetFields: IFieldForMapping[] = [...targetFields];

      const registerMapping = (originSlug: string, targetSlug: string) => {
        // TODO: Take into consideration match strength

        if (usedOriginSlugs.has(originSlug)) return;
        if (usedTargetSlugs.has(targetSlug)) return;

        mappings[originSlug] = targetSlug;
        usedOriginSlugs.add(originSlug);
        usedTargetSlugs.add(targetSlug);
      };

      const filterFieldsBasedOnUsageAndType = () => {
        unmappedOriginFields = unmappedOriginFields.filter(
          (field) =>
            !usedOriginSlugs.has(field.slug) && field.type === fieldType
        );

        unmappedTargetFields = unmappedTargetFields.filter(
          (field) =>
            !usedTargetSlugs.has(field.slug) && field.type === fieldType
        );
      };

      filterFieldsBasedOnUsageAndType();

      // Starting looking for exact matches to "slug" field
      unmappedOriginFields.forEach((originField) => {
        const matchingTargetField = unmappedTargetFields.find(
          (f) => f.slug === originField.slug
        );

        if (matchingTargetField) {
          registerMapping(originField.slug, matchingTargetField.slug);
        }
      });

      filterFieldsBasedOnUsageAndType();

      // Next, look for exact matches to "name" field
      unmappedOriginFields.forEach((field) => {
        const matchingTargetField = unmappedTargetFields.find(
          (f) => f.name.toLowerCase() === field.name.toLowerCase()
        );

        if (matchingTargetField) {
          registerMapping(field.slug, matchingTargetField.slug);
        }
      });

      filterFieldsBasedOnUsageAndType();

      // Compare names of fields and find closest match
      for await (const originField of unmappedOriginFields) {
        const mappingDecisionCacheKey = `${cacheKeyPrefix}${originField.slug}`;
        const mappingDecisionCacheVal =
          this.mappingDecisionCache[mappingDecisionCacheKey];

        if (cacheKeyPrefix && mappingDecisionCacheVal !== undefined) {
          registerMapping(originField.slug, mappingDecisionCacheVal);
          continue;
        }

        const originFieldName = originField.name;

        const matchingNames = closestMatch(
          originFieldName.toLowerCase(),
          unmappedTargetFields.map((f) => f.name.toLowerCase()),
          true
        );

        if (!matchingNames) continue;

        const firstMatch = Array.isArray(matchingNames)
          ? matchingNames[0]
          : matchingNames;

        const differenceBetweenNames = getMatchDistance(
          originFieldName,
          firstMatch
        );

        if (differenceBetweenNames === 0) {
          const matchedTargetGroup = unmappedTargetFields.find(
            (f) => f.name === firstMatch
          );

          if (matchedTargetGroup) {
            registerMapping(originField.slug, matchedTargetGroup.slug);
          }
        } else {
          const selectOptions = unmappedTargetFields.map((f) => f.name);

          if (selectOptions.length > 0) {
            console.log(`Select which field to link ${originField.name} to`);

            const selection = await cliSelect({
              values: Array.isArray(matchingNames)
                ? ["(none)", ...selectOptions]
                : [],
            });

            console.log(`Selected ${selection.value}`);

            if (selection.value === "(none)") {
              if (cacheKeyPrefix) {
                this.mappingDecisionCache[mappingDecisionCacheKey] = "";
              }

              continue;
            }

            const matchedTargetGroup = unmappedTargetFields.find(
              (f) => f.name === selection.value
            );

            if (matchedTargetGroup) {
              if (cacheKeyPrefix) {
                this.mappingDecisionCache[mappingDecisionCacheKey] =
                  matchedTargetGroup.slug;
              }

              registerMapping(originField.slug, matchedTargetGroup.slug);

              // Filtered right now so next user-selections do not
              // show the option that was just selected
              filterFieldsBasedOnUsageAndType();
            }
          }
        }
      }
    }

    return mappings;
  }
}
