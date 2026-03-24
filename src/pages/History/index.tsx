import { useEffect, useState } from "react";
import { TorrentHistory } from "../../components/History";
import { Back } from "../../components/Utils/back";
import Input from "../../components/Input/Input";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faGear } from "@fortawesome/free-solid-svg-icons";
import { FloatingDiv } from "../../components/Utils/floating-div";
import { useNavigate } from "react-router";
import Button from "../../components/Button/button";
import { moveTorrent } from "../../lib/utils";
import path from "path-browserify";

export default function History() {
  let [torrents, setTorrents] = useState<Map<string, DownloadHistory>>(
    new Map(),
  );
  const [searchTorrents, setSearchTorrents] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const nav = useNavigate();
  const [fuse, setFuse] = useState<Fuse<DownloadHistory>>();
  const reload = () => {
    window.electron.getAllDH().then((t) => {
      setTorrents(t);
    });
  };
  let clickTimeout: NodeJS.Timeout | null = null;

  function handleClick(infoHash: string) {
    if (clickTimeout || selectMode) return;
    clickTimeout = setTimeout(() => {
      if (infoHash.startsWith("unknown:")) return;
      nav(`/home_cinema/torrents/${infoHash}/files`);
    }, 250);
  }

  function handleDoubleClick(infoHash: string) {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      setSelectMode(true);
      const set = new Set([infoHash]);
      setSelectedItems(set);
    }
  }
  useEffect(() => {
    reload();
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
      {showDeleteWarning && (
        <FloatingDiv blur onClose={() => setShowDeleteWarning(false)}>
          <div className="flex flex-col gap-3 justify-center items-center">
            <h1>
              Are you sure you want to delete {selectedItems.size} torrents.
            </h1>
            <p className="text-[#ffffff75]">This action is irreversible.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteWarning(false);
                }}
                className="glass! bg-white/10! hover:inset-shadow-white/60! hover:inset-shadow-sm duration-300! text-base! ps-6! pr-6!"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  selectedItems.forEach(async (infoHash) => {
                    let torrent = torrents.get(infoHash);
                    if (torrent && torrent.name) {
                      await window.electron.deleteDH(
                        path.join(torrent.path, torrent.name),
                      );
                    }
                  });
                  setSelectMode(false);
                  setSelectedItems(new Set());
                  setShowDeleteWarning(false);
                  reload();
                }}
                className="glass! bg-red-500/20! hover:bg-red-500/30! duration-300! text-base! ps-6! pr-6!"
              >
                Delete
              </Button>
            </div>
          </div>
        </FloatingDiv>
      )}
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
        {selectMode && (
          <div>
            <h1 className="mt-3">{selectedItems.size} selected items</h1>
            <div className="mb-3 mt-2 flex gap-3">
              <Button
                onClick={() => {
                  setSelectMode(false);
                  setSelectedItems(new Set());
                }}
                className="bg-pop! ps-5! pr-5! text-base! bg-white/10! inset-shadow-none!"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const dest = await window.electron.selectFolder();
                  if (!dest) return;
                  selectedItems.forEach(async (infoHash) => {
                    let torrent = torrents.get(infoHash);
                    if (torrent) {
                      await moveTorrent(torrent, dest);
                    }
                  });
                  setSelectMode(false);
                  setSelectedItems(new Set());
                  reload();
                }}
                className="bg-pop! ps-5! pr-5! text-base! bg-white/30!"
              >
                Move
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteWarning(true);
                }}
                className="bg-pop! ps-5! pr-5! text-base! bg-red-600/30!"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3">
          {torrents &&
            Array.from(search())
              .sort((a, b) => b[1].date - a[1].date)
              .map((t, i, arr) => {
                return (
                  <>
                    {i === 0 || !isSameDate(arr[i - 1][1].date, t[1].date) ? (
                      <h1>{formatUnixDate(t[1].date)}</h1>
                    ) : null}

                    <div
                      onDoubleClick={() => {
                        handleDoubleClick(t[1].infoHash);
                      }}
                    >
                      <TorrentHistory
                        onClick={() => {
                          handleClick(t[1].infoHash);
                        }}
                        selected={selectedItems.has(t[1].infoHash)}
                        selectMode={selectMode}
                        reload={reload}
                        onSelect={() => {
                          const set = new Set(selectedItems);
                          set.add(t[1].infoHash);
                          setSelectedItems(set);
                        }}
                        onDeselect={() => {
                          const set = new Set(selectedItems);
                          set.delete(t[1].infoHash);
                          setSelectedItems(set);
                        }}
                        unknownTorrent={t[0].startsWith("unknown:")}
                        onDeleteTorrent={(infoHash: string) => {
                          let n = new Map(torrents);
                          n.delete(infoHash);
                          setTorrents(n);
                        }}
                        key={i}
                        {...t[1]}
                      />
                    </div>
                  </>
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

function isSameDate(unix1: number, unix2: number) {
  const d1 = new Date(unix1);
  const d2 = new Date(unix2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
function formatUnixDate(unix: number) {
  if (!unix) return `no date`;
  const date = new Date(unix);

  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];

  return `${day} ${month} ${year !== new Date().getFullYear() ? `,${year}` : ""}`;
}
