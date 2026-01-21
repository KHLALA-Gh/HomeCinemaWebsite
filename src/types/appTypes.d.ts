interface TorrentSearch {
  name: string;
  magnetURI: string;
  url: string;
  seeders?: number;
  leechers?: number;
  provider: string;
  uploader?: string;
  infoHash: string;
}

interface TorrentFile {
  name: string;
  size: number;
  path: string;
  path64: string;
  downloadLink: string;
}

interface Download {
  name: string;
  infoHash: string;
  path?: string;
  progress?: number;
  upSpeed?: string;
  downSpeed?: string;
  paused: boolean;
  files: {
    path: string;
    streamed: boolean;
    paused: boolean;
    selected: boolean;
  }[];
  downloadSize?: number;
  totalSize?: number;
  downloaded?: number;
  stopped: boolean;
}
