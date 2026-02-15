import { useEffect, useState } from "react";
import { TorrentHistory } from "../../components/History";
import { Back } from "../../components/Utils/back";
import Input from "../../components/Input/Input";
import Fuse from "fuse.js";

export default function History() {
  let [torrents, setTorrents] = useState<Map<string, DownloadHistory>>(
    new Map(),
  );
  const [searchTorrents, setSearchTorrents] = useState("");
  const [fuse, setFuse] = useState<Fuse<DownloadHistory>>();
  useEffect(() => {
    window.electron.getAllDH().then((t) => {
      setTorrents(t);
    });
  }, []);
  useEffect(() => {
    setFuse(
      new Fuse(Array.from(torrents?.values() || []), {
        keys: ["name"],
        threshold: 0.5,
        ignoreLocation: true,
        includeScore: true,
      }),
    );
  }, [torrents]);
  const search = (): Map<string, DownloadHistory> => {
    if (!searchTorrents.trim() || !fuse) return torrents;
    const result = fuse
      .search(searchTorrents.trim())
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map((t) => [t.item.infoHash, t.item] as [string, DownloadHistory]);
    return new Map(result);
  };
  return (
    <>
      <div className="p-5">
        <Back />
        <div className="mt-5">
          <Input
            placeholder="search"
            value={searchTorrents}
            onChange={(e) => {
              setSearchTorrents(e.target.value);
            }}
          />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {torrents &&
            Array.from(search()).map((t, i) => {
              return (
                <TorrentHistory
                  onDeleteTorrent={(infoHash: string) => {
                    let n = new Map(torrents);
                    n.delete(infoHash);
                    setTorrents(n);
                  }}
                  key={i}
                  {...t[1]}
                />
              );
            })}
          {torrents.size === 0 && (
            <div className="flex justify-center items-center h-[70vh] w-full">
              <h1>No torrent in the library</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
