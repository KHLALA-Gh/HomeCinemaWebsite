interface Configs {
  "torrent-streamer-api": {
    origin: string;
    external: boolean;
  };
}

interface TorrentSearch {
  title: string;
  magnetURI: string;
  desc?: string;
  seeds?: number;
  peers?: number;
}

interface TorrentFile {
  name: string;
  size: number;
  path: string;
  path64: string;
  downloadLink: string;
}
