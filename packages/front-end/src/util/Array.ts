export default class ArrayUtils {
  /**
   * Returns the index of the last element in the array where predicate is true, and -1
   * otherwise.
   * @param array The source array to search in
   * @param predicate find calls predicate once for each element of the array, in descending
   * order, until it finds one where predicate returns true. If such an element is found,
   * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
   */
  public static findLastIndex<T>(
    array: Array<T>,
    predicate: (value: T, index: number, obj: T[]) => boolean,
  ): number {
    let l = array.length;
    while (l >= 1) {
      l -= 1;
      if (predicate(array[l], l, array)) return l;
    }
    return -1;
  }

  public static splitIntoChunks<T>(arr: T[], len: number): T[][] {
    const chunks = [];
    const n = arr.length;
    let i = 0;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }
}
