import { useEffect, useState } from "react";
import { useGetDownloads } from "../../hooks/getDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faDownload,
  faFile,
  faMoon,
  faPause,
  faPlay,
  faRotate,
  faSlash,
  faStop,
  faTrash,
  faUpload,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useDeleteDownload } from "../../hooks/deleteStream";
import NavBar from "../../components/Navbar";
import { Alert } from "@mui/material";
import { usePauseDownload } from "../../hooks/usePauseDownload";
import pr from "pretty-bytes";
import { useNavigate } from "react-router";
import { DownloadBar, SelectFiles } from "../../components/Download";
import { Button } from "@mui/joy";
import path from "path-browserify";
import { fetchConfigs } from "../../hooks/getMagnetURI";
import { FloatingDiv } from "../../components/Utils/floating-div";
import axios from "axios";
export default function PreStreams() {
  const { resp, err, isLoading, fetch, setResp } = useGetDownloads();
  const [torrents, setTorrents] = useState<Map<string, Download>>(new Map());
  const { fetch: fetchPause, resp: respPause } = usePauseDownload();
  const { fetch: fetchDel } = useDeleteDownload();
  const [firstTime, setFirstTime] = useState(true);
  const [selectedTorrent, setSelectedTorrent] = useState<string>("");
  const [openSelectMenu, setOpenSelectMenu] = useState(false);
  useEffect(() => {
    fetch();
    setInterval(() => {
      fetch();
    }, 2000);
  }, []);
  useEffect(() => {
    let found = false;
    resp?.forEach((d) => {
      if (d.infoHash.toLowerCase() === selectedTorrent.toLowerCase()) {
        found = true;
      }
      torrents.set(d.infoHash, d);
    });
    if (!found) setSelectedTorrent("");
    setTorrents(torrents);
  }, [resp]);
  useEffect(() => {
    if (!isLoading) setFirstTime(false);
  }, [isLoading]);
  const findSelectedTorrent = () => {
    return torrents.get(selectedTorrent);
  };
  return (
    <>
      <NavBar />
      {openSelectMenu && (
        <>
          <FloatingDiv onClose={() => setOpenSelectMenu(false)}>
            <SelectFiles
              files={findSelectedTorrent()?.files || []}
              infoHash={selectedTorrent}
              onSet={async (files) => {
                const configs = await fetchConfigs();

                const url = new URL(
                  `/api/downloads/${selectedTorrent}/files`,
                  configs["torrent-streamer-api"].external
                    ? configs["torrent-streamer-api"].origin
                    : location.origin,
                );
                const r = await axios.put(url.href, {
                  selectedFiles: files.map((f) => (f.selected ? f.path : "")),
                });
                if (r.status === 200) {
                  const t = findSelectedTorrent();
                  if (t) t.files = files;
                  setResp(resp);
                  setOpenSelectMenu(false);
                }
              }}
              onError={(err) => {
                alert(err?.message);
              }}
            />
          </FloatingDiv>
        </>
      )}
      <div className="ms-5 mr-5 mt-20">
        {err && (
          <Alert
            severity="error"
            variant="outlined"
            className="!w-fit !mt-5 !text-red-500"
            color="error"
          >
            An error occurred : {err}
          </Alert>
        )}
        {isLoading && firstTime && (
          <div>
            <h1 className="text-center">loading...</h1>
          </div>
        )}
        {resp?.length == 0 && (
          <div className="w-full absolute top-0 h-screen flex justify-center items-center z-[-10] left-0">
            <h1 className="text-lg">There is no pre stream created</h1>
          </div>
        )}
        {resp && torrents.size !== 0 && (
          <div>
            <div className="flex mb-3 gap-2">
              <div
                onClick={async () => {
                  if (!selectedTorrent) return;
                  const r = await fetchDel(selectedTorrent);
                  if (r.status === 200) {
                    let arr = resp.filter(
                      (t) => t.infoHash !== selectedTorrent,
                    );
                    setResp(arr);
                  }
                }}
                className={`border-2  cursor-pointer ${selectedTorrent ? "border-red-600" : "border-gray-500"} w-fit ps-[4px] pr-[4px] rounded-md`}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className={
                    !selectedTorrent ? "text-gray-500" : "text-red-600"
                  }
                />
              </div>
              {!torrents.get(selectedTorrent)?.stopped && (
                <div
                  onClick={async () => {
                    if (!selectedTorrent) return;
                    const r = await fetchPause(selectedTorrent, true);
                    if (r.status === 200) {
                      let arr = resp.map((t) => {
                        if (t.infoHash !== selectedTorrent) return t;
                        return { ...t, stopped: true, paused: true };
                      });
                      setResp(arr);
                    }
                  }}
                  className={`border-2  cursor-pointer ${selectedTorrent ? "border-orange-600" : "border-gray-500"} w-fit ps-[4px] pr-[4px] rounded-md`}
                >
                  <FontAwesomeIcon
                    icon={faStop}
                    className={
                      !selectedTorrent
                        ? "text-gray-500"
                        : findSelectedTorrent()?.stopped
                          ? "text-green-600"
                          : "text-orange-600"
                    }
                  />
                </div>
              )}
              <div
                title={findSelectedTorrent()?.idling ? "torrent is idling" : ""}
                onClick={async () => {
                  if (!selectedTorrent) return;
                  let t = findSelectedTorrent();
                  if (t?.idling) return;
                  let r = await fetchPause(selectedTorrent);
                  if (r.status === 200) {
                    if (!t) return;
                    t.paused = !t.paused;
                    t.stopped = false;
                    setResp(resp);
                  }
                }}
                className={`border-2 relative ${
                  !selectedTorrent || findSelectedTorrent()?.idling
                    ? "border-gray-500"
                    : findSelectedTorrent()?.paused
                      ? "border-green-600 cursor-pointer"
                      : "border-yellow-600 cursor-pointer"
                } w-fit ps-[4px] pr-[4px] rounded-md`}
              >
                <FontAwesomeIcon
                  icon={
                    findSelectedTorrent()?.paused ||
                    findSelectedTorrent()?.stopped
                      ? faPlay
                      : faPause
                  }
                  className={`${
                    !selectedTorrent || findSelectedTorrent()?.idling
                      ? "text-gray-500"
                      : findSelectedTorrent()?.paused
                        ? "text-green-600"
                        : "text-yellow-600"
                  }`}
                />
                {findSelectedTorrent()?.idling && (
                  <div className="absolute top-0">
                    <FontAwesomeIcon
                      icon={faSlash}
                      className="text-gray-500 font-bold"
                    />
                  </div>
                )}
              </div>
              <div
                onClick={async () => {
                  if (!selectedTorrent) return;
                  setOpenSelectMenu(true);
                }}
                className={`border-2 ${!selectedTorrent ? "border-gray-500" : ""} cursor-pointer w-fit ps-[4px] pr-[4px] rounded-md`}
              >
                <FontAwesomeIcon
                  icon={faFile}
                  className={!selectedTorrent ? "text-gray-500" : ""}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              {resp.map((s: Download, i: number) => {
                return (
                  <Download
                    status={s.status}
                    onClick={() => {
                      if (selectedTorrent === s.infoHash) {
                        setSelectedTorrent("");
                        return;
                      }
                      setSelectedTorrent(s.infoHash);
                    }}
                    selected={s.infoHash === selectedTorrent}
                    key={i}
                    download={s}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Download({
  download,
  onClick,
  selected,
  status,
}: {
  download: Download;
  onClick: () => any;
  selected: boolean;
  status: string;
}) {
  const nav = useNavigate();
  const isJustStream = () => {
    for (let d of download.files) {
      if (d.selected) return false;
    }
    return true;
  };
  const isStreaming = () => {
    for (let d of download.files) {
      if (d.streamed) return true;
    }
    return false;
  };
  return (
    <div
      onDoubleClick={() => {
        nav(`/home_cinema/torrents/${download.infoHash}/files`);
      }}
      onClick={onClick}
      className={`hover:bg-[#50505059] cursor-pointer ${status === "setting" ? "bg-blue-600" : selected ? "bg-[#005db4bd]! border-[#005db4] border-2" : download.stopped ? "bg-[#9200006c]" : download.idling ? "bg-[#430073]" : download.isComplete ? "bg-[#0f8500bb]" : download.paused ? "bg-[#98930054]" : "bg-[#151515]"} flex duration-150 gap-5  rounded-md `}
    >
      <div className="lg:flex  items-center p-5  rounded-md">
        <div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={
                download.status === "setting"
                  ? faRotate
                  : download.stopped
                    ? faStop
                    : download.idling
                      ? faMoon
                      : download.isComplete
                        ? faCheck
                        : download.paused
                          ? faPause
                          : faDownload
              }
            />
            {download.status === "setting" ? (
              <p>Loading...</p>
            ) : download.stopped ? (
              <p>STOPPED</p>
            ) : download.idling ? (
              <p>IDLING</p>
            ) : download.isComplete ? (
              <p>COMPLETE</p>
            ) : download.paused ? (
              <p>PAUSED</p>
            ) : (
              <p>DOWNLOADING</p>
            )}
          </div>
          <h1 className="font-bold md:text-lg">{download.name}</h1>
          <div className="flex items-center">
            {((!download.stopped && !download.paused && !download.idling) ||
              isStreaming()) && (
              <>
                {" "}
                <p>
                  <FontAwesomeIcon icon={faUpload} />{" "}
                  {pr(+(download.upSpeed || 0))}/s
                </p>
                <p>
                  <FontAwesomeIcon icon={faDownload} />{" "}
                  {pr(+(download.downSpeed || 0))}/s
                </p>
              </>
            )}
          </div>
          {download.downloadSize !== 0 && !isJustStream() ? (
            <DownloadBar
              download={{
                downloaded: download.downloaded || 0,
                size: download.downloadSize || 0,
              }}
            />
          ) : (
            <p>{"No selected files".toUpperCase()}</p>
          )}
          {isStreaming() && (
            <div>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faVideo} />
                <h1>STREAMING</h1>
              </div>
              {download.files.map((f, i) => {
                if (f.streamed) {
                  return (
                    <div key={i}>
                      <p>{f.path}</p>
                      <DownloadBar
                        download={{
                          downloaded: f.downloaded,
                          size: f.size,
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <h1 className="font-bold">Files</h1>
        <p>
          selected files {download.files.filter((f) => f.selected).length}/
          {download.files?.length}
        </p>
        <p>
          streamed files {download.files.filter((f) => f.streamed).length}/
          {download.files?.length}
        </p>
        <p>
          downloading {pr(download.downloadSize || 0)}/
          {pr(download.totalSize || 0)}
        </p>
      </div>
      <div className="p-5">
        <h1 className="font-bold">Location</h1>
        <p>{download.path}</p>
        <Button
          onClick={async () => {
            if (!download.path) return;
            const c = await fetchConfigs();
            if (!c.desktopMode) return;
            window.electron.openFolder(path.join(download.path, download.name));
          }}
          className="mt-2!"
        >
          Open
        </Button>
      </div>
    </div>
  );
}
