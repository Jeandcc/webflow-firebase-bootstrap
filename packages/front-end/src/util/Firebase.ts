import { FireFunctions, firebase } from '@/services/firebase';

export default class FirebaseUtils {
  /**
   * Used to throttle pings to backend
   */
  private static recentlyPingedFunctions: Set<string> = new Set();

  static async pingFunctions(targets: (string | Function)[]): Promise<void> {
    await Promise.all(
      targets.map(async target => {
        const functionIdentifier =
          typeof target === 'string' ? target : target.toString();

        if (functionIdentifier === '') return;

        if (this.recentlyPingedFunctions.has(functionIdentifier)) return;

        this.recentlyPingedFunctions.add(functionIdentifier);
        window.setTimeout(() => {
          this.recentlyPingedFunctions.delete(functionIdentifier);
        }, 1000 * 60 * 3); // 3 minutes cool-down of ping

        if (typeof target === 'string') {
          await FireFunctions.httpsCallable(target)({ ping: true });
        } else {
          await target({ ping: true });
        }
      }),
    );
  }

  public static getFirestoreTimestamp() {
    return {
      seconds: Date.now() / 1000,
      nanoseconds: Date.now() * 1000000,
      toMillis() {
        return this.seconds * 1000;
      },
      isEqual(timestamp: firebase.firestore.Timestamp) {
        return timestamp.seconds === this.seconds;
      },
      toDate() {
        return new Date(this.seconds * 1000);
      },
      valueOf() {
        return this.seconds.toString();
      },
    };
  }
}
