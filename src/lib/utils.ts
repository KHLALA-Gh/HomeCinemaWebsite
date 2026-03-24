import pathBrowser from "path-browserify";

export async function moveTorrent(torrent: DownloadHistory, dest: string) {
  await window.electron.move(
    pathBrowser.join(torrent.path, torrent.name),
    pathBrowser.join(dest, torrent.name),
  );
  torrent.path = dest;
  await window.electron.setDH(torrent.infoHash, torrent);
}
