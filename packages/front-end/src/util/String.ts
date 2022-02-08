export default class StringUtils {
  public static removeSubString(
    string: string,
    start: number,
    length: number,
  ): string {
    return string.slice(0, start) + string.slice(start + length);
  }

  public static addSubString(
    string: string,
    index: number,
    stringToAdd: string,
  ): string {
    return `${string.slice(0, index)}${stringToAdd}${string.slice(index)}`;
  }

  public static getInitialsOfFirstAndLast(str: string) {
    const splitWords = str.split(' ');
    const initials =
      (splitWords.shift()?.charAt(0) || '') +
      (splitWords.pop()?.charAt(0) || '');

    return initials.toUpperCase();
  }
}
