interface ServerConfig {
  openVLC: boolean;
  desktopMode?: boolean;
  "torrent-streamer-api": {
    origin: string;
    external: boolean;
  };
}
