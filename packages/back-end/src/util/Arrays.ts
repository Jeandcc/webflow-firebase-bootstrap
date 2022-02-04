export default class ArrayUtils {
  public static flatten<T>(arr: (T | T[])[]) {
    const result: T[] = [];

    arr.forEach((i) => {
      if (Array.isArray(i)) {
        result.push(...this.flatten(i));
      } else {
        result.push(i);
      }
    });

    return result;
  }
}
