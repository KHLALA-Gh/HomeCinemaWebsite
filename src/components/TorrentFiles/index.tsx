import { FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { useCreatePreStream } from "../../hooks/useCreatePreStream";
import { useNavigate } from "react-router";
import {
  faCopy,
  faDownload,
  faFile,
  faPlay,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pr from "pretty-bytes";
import Button from "@mui/joy/Button";
import pb from "pretty-bytes";

function getVideos(files: TorrentFile[]): number {
  let num = 0;
  files.map((f) => {
    if (!(f.name.endsWith(".mp4") || f.name.endsWith(".mkv"))) {
      num++;
    }
  });
  return num;
}
interface TorrentFilesProps {
  hash: string;
  resp: TorrentFile[];
  isLoading: boolean;
  err?: string;
}
export function TorrentFiles({
  hash,
  resp,
  isLoading,
  err,
}: TorrentFilesProps) {
  const [showStreamUrl, setShowStreamUrl] = useState(false);
  const {
    resp: createStreamResp,
    isLoading: isLoadingPreStream,
    err: errPreStream,
    fetch,
  } = useCreatePreStream();
  const [easyView, setEasyView] = useState(false);

  const [showOnlyVideo, setShowOnlyVideo] = useState<number>(+localStorage.sov);
  const navigate = useNavigate();
  const createStream = (path: string) => {
    fetch(hash as string, path);
    setShowStreamUrl(true);
  };
  return (
    <>
      <div className="border-[2px] ms-3 mr-3 bg-[#ffffff0d] border-[#ffffff4f] drop-shadow-md rounded-sm">
        <h1 className="text-xl font-bold p-5">Files</h1>

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
              className="!ms-4 !mt-3"
              onClick={() => {
                setEasyView(true);
              }}
            >
              Easy View
            </Button>
            <div className="p-5">
              {resp?.map((file, i) => {
                if (
                  showOnlyVideo &&
                  !(file.name.endsWith(".mp4") || file.name.endsWith(".mkv"))
                )
                  return;
                return (
                  <div
                    key={i}
                    className="md:p-5 p-2 md:text-base !text-sm items-center grid-cols-12 rounded-md hover:bg-[#50505059] duration-200 md:grid gap-10 cursor-pointer flex-wrap"
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
                      target="_blank"
                      href={file.downloadLink}
                      className="col-span-4 hover:underline"
                    >
                      {file.name}
                    </a>
                    <p className="xl:col-span-1 col-span-3 xl:block hidden">
                      {pr(file.size)}
                    </p>

                    <button
                      className="lg:col-span-3 col-span-1 xl:block hidden"
                      onClick={() => {
                        navigator.clipboard.writeText(file.downloadLink);
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />{" "}
                      <span className="lg:inline-block hidden">
                        Copy Stream URL
                      </span>
                    </button>
                    {(file.name.endsWith(".mp4") ||
                      file.name.endsWith(".mkv")) && (
                      <button
                        onClick={() => {
                          const url = new URL("/api/playlist", location.origin);
                          url.searchParams.set("streams", file.downloadLink);
                          url.searchParams.set("fileName", file.name);
                          open(url.href);
                        }}
                        className="items-center col-span-1 xl:flex hidden"
                      >
                        <FontAwesomeIcon icon={faPlay} className="mr-2" />
                        play
                      </button>
                    )}
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
                      <div
                        className="w-fit cursor-pointer"
                        onClick={() => {
                          open(file.downloadLink, "_blank");
                        }}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </div>
                    </div>
                    {(file.name.endsWith(".mp4") ||
                      file.name.endsWith(".mkv")) && (
                      <Button
                        className="xl:col-span-2 col-span-4 !text-base md:!block !hidden"
                        color="neutral"
                        loading={isLoadingPreStream}
                        disabled={showStreamUrl}
                        onClick={() => {
                          createStream(file.path);
                        }}
                        variant="soft"
                        size="lg"
                      >
                        Create PreStream
                      </Button>
                    )}

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
                      {(file.name.endsWith(".mp4") ||
                        file.name.endsWith(".mkv")) && (
                        <Button
                          className="!text-[14px] !pt-0 !pb-0 !ps-2 !pr-2"
                          color="neutral"
                          loading={isLoadingPreStream}
                          disabled={showStreamUrl}
                          onClick={() => {
                            createStream(file.path);
                          }}
                          variant="soft"
                          size="sm"
                        >
                          Create PreStream
                        </Button>
                      )}
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
          <div
            onClick={() => setEasyView(false)}
            className="top-0 fixed bg-[#00000050] w-full h-screen flex items-center  justify-center"
          ></div>

          <div className="fixed top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%]">
            <div className="flex justify-between bg-black p-2">
              <h1 className=" text-xl font-bold  relative">Easy View </h1>
              <div
                className="cursor-pointer"
                onClick={() => setEasyView(false)}
              >
                <FontAwesomeIcon icon={faXmark} className="h-7 mr-2" />
              </div>
            </div>
            <EasyView resp={resp} />
          </div>
        </>
      )}
    </>
  );
}

function EasyView({ resp }: { resp: TorrentFile[] }) {
  let elements = resp.map((f, i) => {
    if (!f.name.endsWith(".mp4") && !f.name.endsWith(".mkv")) return;
    let match = f.name.toUpperCase().match(/S(\d+)E(\d+)/);
    if (!match) return;

    return (
      <div
        key={i}
        className="mb-2 p-2  grid grid-cols-12 duration-200 hover:bg-[#b4b4b43e]"
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
        <div className="flex gap-3 items-center justify-center col-span-3 bg-[#202020] p-2 rounded-md">
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
              open(f.downloadLink, "_blank");
            }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </div>
      </div>
    );
  });
  elements = elements.filter((e) => e !== undefined);
  return (
    <>
      <div className="bg-[#0f0f0f] min-w-[300px] max-w-[500px] relative min-h-[100px] max-h-[300px] overflow-y-auto">
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
