export {};

declare global {
  interface Window {
    electron: {
      selectFolder: () => Promise<string | null>;
      openFolder: (path: string) => Promise<void>;
      openVLC: (streams: string[]) => void;
    };
  }
}
