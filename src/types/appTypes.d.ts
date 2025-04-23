interface Configs {
  "torrent-streamer-api": {
    origin: string;
    external: boolean;
  };
}

interface TorrentSearch {
  name: string;
  magnetURI: string;
  url: string;
  seeders?: number;
  leechers?: number;
  provider: string;
  uploader?: string;
}

interface TorrentFile {
  name: string;
  size: number;
  path: string;
  path64: string;
  downloadLink: string;
}
