import { useEffect, useState } from "react";
import { TorrentHistory } from "../../components/History";
import { Back } from "../../components/Utils/back";
import Input from "../../components/Input/Input";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faGear } from "@fortawesome/free-solid-svg-icons";
import { FloatingDiv } from "../../components/Utils/floating-div";

export default function History() {
  let [torrents, setTorrents] = useState<Map<string, DownloadHistory>>(
    new Map(),
  );
  const [searchTorrents, setSearchTorrents] = useState("");
  const [showSettings, setShowSettings] = useState(false);

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
      {showSettings && (
        <FloatingDiv
          blur
          title="Library Settings"
          onClose={() => setShowSettings(false)}
        >
          <div className="flex flex-col gap-5  settings-lib p-3">
            <div
              onClick={async (t) => {
                let newDir = await window.electron.selectFolder();
                if (!newDir) {
                  alert("no folder set");
                  return;
                }
                await window.electron.changeDHDir(newDir);
                let p = document.getElementById("f-set");
                if (!p) return;
                p.textContent = "Folder changed";
              }}
              className="cursor-pointer flex glass border-2 border-black/20 items-center justify-between"
            >
              <h1>Change Library Folder</h1>
              <p id="f-set" className="text-green-700"></p>
              <FontAwesomeIcon icon={faFolder} />
            </div>
          </div>
        </FloatingDiv>
      )}
      <div className="p-5">
        <div className="flex gap-3">
          <Back />
          <div
            onClick={() => setShowSettings(true)}
            className="glass-white cursor-pointer flex justify-center w-10 h-10 items-center rounded-full"
          >
            <FontAwesomeIcon icon={faGear} color="black" size="lg" />
          </div>
        </div>
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
