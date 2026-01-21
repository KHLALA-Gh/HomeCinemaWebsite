import { useEffect, useState } from "react";
import { useGetDownloads } from "../../hooks/getDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateBack,
  faDownload,
  faFile,
  faPause,
  faPlay,
  faRecycle,
  faRedo,
  faRepeat,
  faRotate,
  faSlash,
  faStop,
  faTrash,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDeleteDownload } from "../../hooks/deleteStream";
import NavBar from "../../components/Navbar";
import { Alert } from "@mui/material";
import { usePauseDownload } from "../../hooks/usePauseDownload";
import pr from "pretty-bytes";
import { useNavigate } from "react-router";
export default function PreStreams() {
  const { resp, err, isLoading, fetch, setResp } = useGetDownloads();
  const { fetch: fetchPause, resp: respPause } = usePauseDownload();
  const { fetch: fetchDel } = useDeleteDownload();
  const [firstTime, setFirstTime] = useState(true);
  const [selectedTorrent, setSelectedTorrent] = useState<string>();
  useEffect(() => {
    fetch();
    setInterval(() => {
      fetch();
    }, 2000);
  }, []);
  useEffect(() => {}, [respPause]);
  useEffect(() => {
    if (!isLoading) setFirstTime(false);
  }, [isLoading]);
  const findSelectedTorrent = () => {
    if (!resp) return;
    for (let d of resp) {
      if (d.infoHash.toLowerCase() === selectedTorrent?.toLowerCase()) return d;
    }
  };
  return (
    <>
      <NavBar />
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
        {resp && resp.length !== 0 && (
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
              {!findSelectedTorrent()?.stopped && (
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
                title={
                  findSelectedTorrent()?.files.filter((f) => f.streamed).length
                    ? "Cannot pause (file being streamed)"
                    : ""
                }
                onClick={async () => {
                  if (!selectedTorrent) return;
                  let t = findSelectedTorrent();
                  if (t?.files.filter((f) => f.streamed).length) return;
                  let r = await fetchPause(selectedTorrent);
                  if (r.status === 200) {
                    if (!t) return;
                    t.paused = !t.paused;
                    t.stopped = false;
                    setResp(resp);
                  }
                }}
                className={`border-2 relative ${
                  !selectedTorrent ||
                  findSelectedTorrent()?.files.filter((f) => f.streamed).length
                    ? "border-gray-500"
                    : findSelectedTorrent()?.paused
                      ? "border-green-600 cursor-pointer"
                      : "border-yellow-600 cursor-pointer"
                } w-fit ps-[4px] pr-[4px] rounded-md`}
              >
                <FontAwesomeIcon
                  icon={findSelectedTorrent()?.paused ? faPlay : faPause}
                  className={`${
                    !selectedTorrent ||
                    findSelectedTorrent()?.files.filter((f) => f.streamed)
                      .length
                      ? "text-gray-500"
                      : findSelectedTorrent()?.paused
                        ? "text-green-600"
                        : "text-yellow-600"
                  }`}
                />
                {findSelectedTorrent() &&
                  findSelectedTorrent()?.files.filter((f) => f.streamed)
                    .length !== 0 && (
                    <div className="absolute top-0">
                      <FontAwesomeIcon
                        icon={faSlash}
                        className="text-gray-500 font-bold"
                      />
                    </div>
                  )}
              </div>
              <div
                onClick={() => {
                  if (!selectedTorrent) return;
                  fetchDel(selectedTorrent);
                }}
                className={`border-2 ${!selectedTorrent ? "border-gray-500" : ""} cursor-pointer w-fit ps-[4px] pr-[4px] rounded-md`}
              >
                <FontAwesomeIcon
                  icon={faFile}
                  className={!selectedTorrent ? "text-gray-500" : ""}
                />
              </div>
            </div>
            {resp.map((s: Download, i: number) => {
              return (
                <Download
                  onClick={() => {
                    if (selectedTorrent === s.infoHash) {
                      setSelectedTorrent(undefined);
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
        )}
        {}
      </div>
    </>
  );
}

function Download({
  download,
  onClick,
  selected,
}: {
  download: Download;
  onClick: () => any;
  selected: boolean;
}) {
  const nav = useNavigate();

  return (
    <div
      onDoubleClick={() => {
        nav(`/home_cinema/torrents/${download.infoHash}/files`);
      }}
      onClick={onClick}
      className={`hover:bg-[#50505059] cursor-pointer ${selected ? "bg-[#005db4bd]!" : download.stopped ? "bg-[#9200006c]" : download.paused ? "bg-[#98930054]" : ""} flex duration-150 gap-5  rounded-md `}
    >
      <div className="lg:flex  items-center p-5  rounded-md">
        <div>
          <h1 className="font-bold md:text-lg">{download.name}</h1>
          <div className="flex items-center">
            {download.stopped ? (
              <p>STOPPED</p>
            ) : download.paused ? (
              <p>PAUSED</p>
            ) : (
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
          <div>
            {pr(download.downloaded || 0)} / {pr(download.downloadSize || 0)}
          </div>
          <div className="flex items-center gap-5">
            <div className="w-[200px] relative bg-white h-2 rounded-full">
              <div
                style={{
                  width: `${((download.progress || 0) * 100).toFixed()}%`,
                }}
                className={`h-2 bg-green-600 rounded-full`}
              ></div>
            </div>

            <p>
              {(
                ((download.downloaded || 0) / (download.downloadSize || 1)) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
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
          downloading {pr(download.totalSize || 0)}/
          {pr(download.downloadSize || 0)}
        </p>
      </div>
      <div className="p-5">
        <h1 className="font-bold">Location</h1>
        <p>{download.path}</p>
      </div>
    </div>
  );
}
