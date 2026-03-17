import { useEffect, useState } from "react";
import { useTorrentSearch } from "../../hooks/getTorrentSearch";

interface SmallTorrentSearchProps {
  query: string;
  limit?: number;
  onClickTorrent?: (t: TorrentSearch) => void;
}

export function SmallTorrentSearch({
  query,
  limit,
  onClickTorrent,
}: SmallTorrentSearchProps) {
  const { resp, fetch, isLoading, err } = useTorrentSearch();
  const [torrents, setTorrents] = useState<Map<string, TorrentSearch>>(
    new Map(),
  );
  useEffect(() => {
    console.log(query);
    fetch(query, limit);
  }, []);
  useEffect(() => {
    const newMap = new Map();
    resp?.forEach((v, i) => {
      v.infoHash = v.infoHash.toLowerCase();
      newMap.set(v.infoHash, v);
    });
    setTorrents(newMap);
  }, [resp]);
  return (
    <>
      <div className="rounded-lg p-5">
        {isLoading && <p>Searching...</p>}
        {torrents.size && (
          <div className="flex flex-col gap-5">
            {Array.from(torrents.values()).map((v, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (onClickTorrent) onClickTorrent(v);
                  }}
                >
                  <h1>{v.name}</h1>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
