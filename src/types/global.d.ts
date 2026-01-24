export {};

declare global {
  interface Window {
    electron: {
      selectFolder: () => Promise<string | null>;
      openVLC: (streams: string[]) => void;
    };
  }
}
