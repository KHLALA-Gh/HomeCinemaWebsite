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
  selectedFiles?: string[];
  progress: number;
  upSpeed: string;
  downSpeed: string;
}
