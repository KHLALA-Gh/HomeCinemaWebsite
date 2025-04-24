import { useNavigate, useParams, useSearchParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCopy,
  faFile,
  faPlay,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "../../components/Button/button";
import { FormControlLabel, Switch } from "@mui/material";

function getVideos(files: TorrentFile[]): number {
  let num = 0;
  files.map((f) => {
    if (!(f.name.endsWith(".mp4") || f.name.endsWith(".mkv"))) {
      num++;
    }
  });
  return num;
}

export default function TorrentFiles() {
  const p = useParams();
  const [sp, _] = useSearchParams();
  const { resp, isLoading, err } = useTorrentFiles(p.hash as string);
  const [streams, setStreams] = useState<string[]>();
  const [size, setSize] = useState<number>();
  const [showOnlyVideo, setShowOnlyVideo] = useState<number>(+localStorage.sov);
  const navigate = useNavigate();
  useEffect(() => {
    if (!resp) return;
    let size = 0;
    resp?.map((file) => {
      if (file.name.endsWith(".mp4") || file.name.endsWith(".mkv")) {
        size += file.size;
        setStreams((s) => {
          if (s) {
            return [...s, file.downloadLink];
          } else {
            return [file.downloadLink];
          }
        });
      }
    });
    setSize(size);
  }, [resp]);
  return (
    <>
      <div
        className="cursor-pointer mt-7 ms-3 flex items-center gap-3"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-7" />
        <h1 className="font-bold text-3xl">Inspect Torrent</h1>
      </div>

      {streams && streams?.length > 0 && (
        <div className="p-5">
          <h1 className="md:text-3xl font-bold mb-3">
            {resp && <h1>{resp[0].path.split("/")[0]}</h1>}
          </h1>
          <Button
            onClick={() => {
              const url = new URL("/api/playlist", location.origin);
              streams.map((s) => {
                url.searchParams.append("streams", s);
              });
              if (resp) {
                url.searchParams.set("fileName", resp[0].path.split("/")[0]);
              }
              open(url.href);
            }}
          >
            <FontAwesomeIcon icon={faPlay} className="mr-3" /> Play
          </Button>
        </div>
      )}
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
                    className="p-5 grid-cols-12 rounded-md hover:bg-[#50505059] duration-200 grid gap-10 cursor-pointer flex-wrap"
                  >
                    <div className="col-span-1">
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
                      className="col-span-6 hover:underline"
                    >
                      {file.name}
                    </a>
                    <p className="col-span-1">{pr(file.size)}</p>

                    <button
                      className="col-span-2"
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
                        className="flex items-center"
                      >
                        <FontAwesomeIcon icon={faPlay} className="mr-2" />
                        play
                      </button>
                    )}
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

      <div className="ps-5 mt-7">
        <p className="mb-3">{pr((size as number) || 0)}</p>
        {sp.get("peers") && sp.get("seeds") && (
          <p>
            Seeds : {sp.get("seeds")} leechers : {sp.get("leechers")}
          </p>
        )}
        {sp.get("about") && (
          <p className=" mb-3">
            About :{" "}
            <a
              target="_blank"
              className="text-blue-500"
              href={sp.get("about") as string}
            >
              {sp.get("about")}
            </a>
          </p>
        )}
        <p className="text-sm mb-5">Info Hash : {p.hash}</p>
      </div>
      {err && (
        <h1 className="text-red-500">An error occurred while getting files</h1>
      )}
      {resp?.length === 0 && !isLoading && (
        <h1>No files found. It could be 0 seeders</h1>
      )}
    </>
  );
}
