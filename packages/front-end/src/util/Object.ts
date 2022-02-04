export default class ObjectUtils {
  /**
   * @param ob Object to sanitize
   * @returns Object with sanitized properties (no Dates and etc), and only one-level-deep properties
   */
  public static flattenObject(ob: Record<string, any>) {
    const toReturn: Record<string, any> = {};

    Object.keys(ob).forEach(i => {
      if (typeof ob[i] === 'object' && ob[i] !== null) {
        // If is timestamp
        if (ob[i].seconds !== undefined && ob[i].nanoseconds !== undefined) {
          toReturn[i] = new Date(ob[i].seconds * 1000).toUTCString();
        } else {
          const flatObject = ObjectUtils.flattenObject(ob[i]);

          Object.keys(flatObject).forEach(x => {
            toReturn[`${i}.${x}`] = flatObject[x];
          });
        }
      } else {
        toReturn[i] = ob[i];
      }
    });

    return toReturn;
  }
}
