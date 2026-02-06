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
  playing?: boolean;
}
interface DownloadFile {
  path: string;
  streamed: boolean;
  paused: boolean;
  selected: boolean;
  size: number;
  downloaded: number;
}
interface Download {
  name: string;
  infoHash: string;
  path?: string;
  progress?: number;
  upSpeed?: string;
  downSpeed?: string;
  paused: boolean;
  files: DownloadFile[];
  downloadSize?: number;
  totalSize?: number;
  downloaded?: number;
  stopped: boolean;
  status: string;
  idling: boolean;
  isComplete: boolean;
}
