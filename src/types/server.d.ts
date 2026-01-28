interface Version {
  name: string;
  semVer: string;
}

interface ServerConfig {
  version: Version;
  openVLC: boolean;
  desktopMode?: boolean;
  "torrent-streamer-api": {
    origin: string;
    external: boolean;
  };
}
