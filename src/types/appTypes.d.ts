interface Configs {
  "torrent-streamer-api": {
    origin: string;
    external: boolean;
  };
}

interface TorrentSearch {
  title: string;
  magnetURI: string;
}

interface TorrentFile {
  name: string;
  size: number;
  path: string;
  path64: string;
  downloadLink: string;
}
