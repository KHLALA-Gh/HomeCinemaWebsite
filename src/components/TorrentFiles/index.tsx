import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useCreatePreStream } from "../../hooks/useCreatePreStream";
import { useNavigate } from "react-router";
import {
  faCopy,
  faDownload,
  faFile,
  faFloppyDisk,
  faPlay,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pr from "pretty-bytes";
import Button from "../../components/Button/button";
import { Button as JoyButton } from "@mui/joy";
import pb from "pretty-bytes";
import { fetchConfigs } from "../../hooks/getMagnetURI";
import { useDownloadTorrent } from "../../hooks/useDownloadTorrent";
import { SaveButton } from "../Movie/Movie";
import { FloatingDiv } from "../Utils/floating-div";
import { SelectFiles } from "../Download";
import axios from "axios";

function getVideos(files: TorrentFile[]): number {
  let num = 0;
  files.map((f) => {
    if (!(f.name.endsWith(".mp4") || f.name.endsWith(".mkv"))) {
      num++;
    }
  });
  return num;
}
interface Streams {
  streamUrl: string;
  name: string;
}
interface TorrentFilesProps {
  hash: string;
  resp: TorrentFile[];
  isLoading: boolean;
  err?: string;
  onSave: () => void;
  saved: boolean;
}
export function TorrentFiles({
  hash,
  resp,
  isLoading,
  err,
  saved,
  onSave,
}: TorrentFilesProps) {
  const [showStreamUrl, setShowStreamUrl] = useState(false);
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [playing, setPlaying] = useState<Set<string>>(new Set());
  const {
    resp: createStreamResp,
    isLoading: isLoadingPreStream,
    err: errPreStream,
    fetch,
  } = useCreatePreStream();
  const [easyView, setEasyView] = useState(false);
  const { run, resp: downloadResp } = useDownloadTorrent();
  const [showOnlyVideo, setShowOnlyVideo] = useState<number>(+localStorage.sov);
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<ServerConfig>();
  const createStream = (path: string) => {
    fetch(hash as string, path);
    setShowStreamUrl(true);
  };
  const [size, setSize] = useState<number>();
  const [streams, setStreams] = useState<Streams[]>();
  const [openSelectFiles, setOpenSelectFiles] = useState(false);
  useEffect(() => {
    if (!resp) return;
    let size = 0;
    resp?.map((file) => {
      if (file.name.endsWith(".mp4") || file.name.endsWith(".mkv")) {
        size += file.size;
        setStreams((s) => {
          if (s) {
            return [...s, { streamUrl: file.downloadLink, name: file.name }];
          } else {
            return [{ streamUrl: file.downloadLink, name: file.name }];
          }
        });
      }
    });
    setSize(size);
  }, [resp]);
  useEffect(() => {
    fetchConfigs().then((c) => setConfigs(c));
  }, []);
  useEffect(() => {
    if (downloadResp?.status === 208) {
      alert(downloadResp.data.err);
    }
  }, [downloadResp]);
  return (
    <>
      {openSelectFiles && (
        <FloatingDiv
          title="Select Files"
          onClose={() => setOpenSelectFiles(false)}
        >
          <SelectFiles
            files={resp.map((f) => {
              return {
                selected: true,
                paused: false,
                downloaded: 0,
                size: f.size,
                streamed: false,
                path: f.path,
              } as DownloadFile;
            })}
            infoHash={hash}
            onSet={async (files, l) => {
              setOpenSelectFiles(false);

              const configs = await fetchConfigs();

              const url = new URL(
                `/api/torrents/${hash}/download`,
                configs["torrent-streamer-api"].external
                  ? configs["torrent-streamer-api"].origin
                  : location.origin,
              );
              let path = l || (await window.electron.getDHPath());
              window.electron.setDH(hash.toLowerCase(), {
                infoHash: hash,
                name: resp[0]?.path.split("/")[0],
                path: path || "undefined",
              });
              const r = await axios.post(url.href, {
                files: files.map((f) => (f.selected ? f.path : "")),
                path,
              });

              throw new Error(r.data);
            }}
            onError={(err) => {
              alert("an error occured");
              console.log(err);
            }}
          />
        </FloatingDiv>
      )}
      <div className=" ms-3 mr-3 bg-[#ffffff0d]  drop-shadow-md rounded-2xl pop">
        <div className="p-5">
          <div className="flex gap-3 items-center mb-3">
            <h1 className="md:text-3xl font-bold">
              {resp && <h1>{resp[0]?.path.split("/")[0]}</h1>}
            </h1>
            <SaveButton onClick={onSave} saved={saved} />
          </div>
          <p
            onClick={(t) => {
              //@ts-ignore

              if (t.target.textContent === "Copied ✔") return;
              navigator.clipboard.writeText(hash);
              //@ts-ignore
              t.target.textContent = "Copied ✔";
              setTimeout(() => {
                //@ts-ignore

                t.target.textContent = hash;
              }, 5000);
            }}
            className="mb-3 select-none min-w-[400px] text-center glass rounded-2xl p-2 w-fit duration-200 cursor-pointer hover:scale-105 hover:ps-3 hover:pr-3"
          >
            {hash}
          </p>

          <div className="flex gap-3 items-center">
            {streams && streams?.length > 0 && (
              <Button
                className="glass-white flex  justify-center items-center h-10 text-center text-[0px]! duration-200 hover:text-[16px]! bg-white/10! ps-6! pr-6! pt-3! pb-3! text-base!"
                onClick={() => {
                  if (configs?.desktopMode) {
                    window.electron.openVLC(streams.map((s) => s.streamUrl));
                  } else {
                    const url = new URL("/api/playlist", location.origin);
                    streams.map((s) => {
                      url.searchParams.append("streams", s.streamUrl);
                      url.searchParams.append("names", s.name);
                    });
                    if (resp) {
                      url.searchParams.set(
                        "fileName",
                        resp[0].path.split("/")[0],
                      );
                    }
                    open(url.href);
                  }
                }}
              >
                <FontAwesomeIcon icon={faPlay} className=" text-base!" />
                <p> Play</p>
              </Button>
            )}
            {configs?.desktopMode && !isLoading && (
              <button
                onClick={async () => {
                  setOpenSelectFiles(true);
                }}
                className="bg-white/10 glass cursor-pointer text-[0px] hover:text-base duration-200 rounded-full min-w-10 h-10 flex items-center justify-center p-2 font-bold"
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="text-base!" />
                <p>Download</p>
              </button>
            )}
          </div>
        </div>

        <div className="ps-5 mb-1">
          <h1 className="text-xl font-bold">Files</h1>
          <p className="text-sm mt-1">{pr((size as number) || 0)}</p>
        </div>

        <FormControlLabel
          control={
            <Switch
              color="info"
              checked={showOnlyVideo ? true : false}
              onChange={(_, ch) => {
                setShowOnlyVideo(ch ? 1 : 0);
                localStorage.sov = ch ? 1 : 0;
              }}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: "lightgray",
                },
                "&.Mui-checked .MuiSwitch-track": {
                  backgroundColor: "green", // color when checked
                },
              }}
            />
          }
          label="Only show video files"
          labelPlacement="start"
        />

        {!err && !isLoading && resp && (
          <>
            <div className="ps-5">
              <ul className="flex gap-5" style={{ listStyleType: "circle" }}>
                <li className="list-none">{resp?.length} files </li>
                {showOnlyVideo ? <li>{getVideos(resp)} Hidden files</li> : ""}
              </ul>
            </div>
            <Button
              className="ms-4! mt-3! glass-white bg-white/10! ps-6! pr-6! pt-2! pb-2! text-base!"
              onClick={() => {
                setEasyView(true);
              }}
            >
              Easy View
            </Button>
            <div className="p-5">
              {resp?.map((file, i) => {
                const isVid =
                  file.name.endsWith(".mp4") ||
                  file.name.endsWith(".mkv") ||
                  file.name.endsWith(".avi");
                if (showOnlyVideo && !isVid) return;
                return (
                  <div
                    key={i}
                    className="md:p-5 pop p-2 md:text-base text-sm! items-center grid-cols-12 rounded-2xl hover:bg-[#50505059] duration-200 md:grid gap-10 cursor-pointer flex-wrap"
                  >
                    <div className="col-span-1 inline-block md:mr-0 mr-5">
                      {file.name.endsWith(".mp4") ||
                      file.name.endsWith(".mkv") ? (
                        <FontAwesomeIcon icon={faVideo} />
                      ) : (
                        <FontAwesomeIcon icon={faFile} />
                      )}
                    </div>
                    <a
                      title={
                        configs?.desktopMode && isVid
                          ? "double click to open"
                          : ""
                      }
                      onDoubleClick={() => {
                        if (configs?.desktopMode && isVid) {
                          window.electron.openVLC([file.downloadLink]);
                        }
                      }}
                      target={configs?.desktopMode ? "" : "_blank"}
                      href={!configs?.desktopMode ? file.downloadLink : "#"}
                      className="col-span-6 hover:underline"
                    >
                      {file.name}
                    </a>

                    {configs?.desktopMode && (
                      <JoyButton
                        loading={playing.has(file.path)}
                        onClick={async () => {
                          if (!isVid) return;
                          try {
                            setPlaying(new Set([...playing, file.path]));
                            await window.electron.openVLC([file.downloadLink]);
                          } catch {
                            alert("error when starting vlc.");
                          } finally {
                            const newSet = new Set(playing);
                            newSet.delete(file.path);
                            setPlaying(newSet);
                          }
                        }}
                        className="items-center bg-transparent! col-span-1 flex cursor-pointer"
                      >
                        {isVid && (
                          <>
                            <FontAwesomeIcon icon={faPlay} className="mr-2" />
                            play
                          </>
                        )}
                      </JoyButton>
                    )}

                    <button
                      className="lg:col-span-3 col-span-1 xl:block hidden cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(file.downloadLink);
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />{" "}
                      <span className="lg:inline-block hidden">
                        Copy Stream URL
                      </span>
                    </button>
                    <p className="xl:col-span-1 col-span-3 xl:block hidden">
                      {pr(file.size)}
                    </p>
                    <div className=" md:flex hidden xl:hidden gap-3 items-center justify-center col-span-3 bg-[#202020] p-2 rounded-md">
                      <h6 className="md:block hidden col-span-1 text-[13px]">
                        {pb(file.size)}
                      </h6>
                      <div
                        className=" col-span-1 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(file.downloadLink);
                        }}
                      >
                        <FontAwesomeIcon icon={faFile} />
                      </div>
                      {!configs?.desktopMode && (
                        <div
                          className="w-fit cursor-pointer"
                          onClick={() => {
                            open(file.downloadLink, "_blank");
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      )}
                    </div>

                    <div className="md:hidden mt-3 flex items-center gap-5">
                      <div className="flex xl:hidden gap-3 items-center justify-center col-span-3 bg-[#202020] p-2 rounded-md">
                        <h6 className="md:block hidden col-span-1 text-[13px]">
                          {pb(file.size)}
                        </h6>
                        <div
                          className=" col-span-1 cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(file.downloadLink);
                          }}
                        >
                          <FontAwesomeIcon icon={faFile} />
                        </div>
                        <div
                          className="w-fit cursor-pointer"
                          onClick={() => {
                            open(file.downloadLink, "_blank");
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {isLoading && !err && (
          <>
            <div className="flex justify-center items-center h-[200px]">
              <h1>Loading files...</h1>
            </div>
          </>
        )}
      </div>
      {err && (
        <h1 className="text-red-500">An error occurred while getting files</h1>
      )}
      {resp?.length === 0 && !isLoading && (
        <h1>No files found. It could be 0 seeders</h1>
      )}
      {showStreamUrl && !isLoading && (
        <>
          <div className="fixed w-full h-screen bg-[#0000007b] top-0"></div>

          <div className="w-[700px] fixed flex justify-center items-center p-5 border-2 border-white h-[300px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-black">
            {(createStreamResp || errPreStream) && (
              <div
                className="ms-[90%] translate-x-[-90%] absolute top-5 cursor-pointer"
                onClick={() => setShowStreamUrl(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
            )}
            {isLoadingPreStream && <h1>loading...</h1>}
            {createStreamResp && (
              <div>
                <h1 className="text-center">
                  <span className="font-bold text-xl mb-5 block">
                    {" "}
                    Stream URL{" "}
                  </span>{" "}
                  <a
                    href={createStreamResp.streamUrl}
                    className="text-blue-600 hover:underline"
                  >
                    {createStreamResp.streamUrl}
                  </a>
                </h1>
                <div>
                  <Button
                    onClick={() => {
                      navigate("/home_cinema/streams");
                    }}
                    className="!text-base !ms-[50%] translate-x-[-50%] !mt-10"
                  >
                    All Streams
                  </Button>
                </div>
              </div>
            )}
            {errPreStream && <h1 className="text-red-600">{errPreStream}</h1>}
          </div>
        </>
      )}

      {easyView && (
        <>
          <FloatingDiv title="Easy View" onClose={() => setEasyView(false)}>
            <EasyView resp={resp} config={configs} />
          </FloatingDiv>
        </>
      )}
    </>
  );
}

function EasyView({
  resp,
  config,
}: {
  resp: TorrentFile[];
  config?: ServerConfig;
}) {
  let elements = resp.map((f, i) => {
    if (!f.name.endsWith(".mp4") && !f.name.endsWith(".mkv")) return;
    let match = f.name.toUpperCase().match(/S(\d+)E(\d+)/);
    if (!match) return;

    return (
      <div
        key={i}
        className="mb-2 p-3 pop rounded-2xl grid grid-cols-12 duration-200 hover:bg-[#b4b4b43e]"
      >
        <div className="col-span-9">
          <h1 className="font-bold">
            Season {parseInt(match[1], 10)} Episode {parseInt(match[2], 10)}
          </h1>
          <h1>
            {f.name.toLowerCase().includes("h265") ||
            f.name.toLowerCase().includes("x265")
              ? "H256"
              : "H264"}
          </h1>
        </div>
        <div className="flex gap-3 items-center justify-center col-span-3 bg-[#202020] p-2 rounded-2xl">
          <h6 className="md:block hidden col-span-1 text-[13px]">
            {pb(f.size)}
          </h6>
          <div
            className=" col-span-1 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(f.downloadLink);
            }}
          >
            <FontAwesomeIcon icon={faFile} />
          </div>
          <div
            className="w-fit cursor-pointer"
            onClick={() => {
              if (config?.desktopMode) {
                window.electron.openVLC([f.downloadLink]);
                return;
              }
              open(f.downloadLink, "_blank");
            }}
          >
            <FontAwesomeIcon icon={config?.desktopMode ? faPlay : faDownload} />
          </div>
        </div>
      </div>
    );
  });
  elements = elements.filter((e) => e !== undefined);
  return (
    <>
      <div className="min-w-[300px] max-w-[500px] relative min-h-[100px] max-h-[300px] overflow-y-auto">
        {resp && elements}
        {!elements.length && (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-center p-5">
              Easy View only works with torrents that have files with{" "}
              <span className="bg-[#b4b4b43e] p-1 rounded-md">
                season-episode
              </span>{" "}
              notation
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
