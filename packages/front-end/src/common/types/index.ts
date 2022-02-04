declare global {
  interface Window {
    Webflow?: {
      ready(): void;
      destroy(): void;
      require(module: string): { init(): void; ready(): void; destroy(): void };
    };
  }
}

// To understand this export, read https://stackoverflow.com/questions/57132428
export {};
