export default class TimeUtils {
  /**
   * A function that converts any amount of seconds to a string
   * formatted as `HH:MM:SS`
   */
  public static secondsToTimeString(seconds: number): string {
    let thisSeconds = seconds;

    const hours = Math.floor(thisSeconds / 3600);
    thisSeconds -= hours * 3600;
    const minutes = Math.floor(thisSeconds / 60);
    thisSeconds -= minutes * 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${thisSeconds.toString().padStart(2, '0')}`;
  }
}
