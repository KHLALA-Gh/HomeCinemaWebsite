import { useNavigate, useParams, useSearchParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCopy,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "../../components/Button/button";
export default function TorrentFiles() {
  const p = useParams();
  const [sp, _] = useSearchParams();
  const { resp, isLoading, err } = useTorrentFiles(p.hash as string);
  const [streams, setStreams] = useState<string[]>();
  const [size, setSize] = useState<number>();
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
        className="cursor-pointer mt-7 ms-3"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-7 mb-5" />
      </div>
      {streams && streams?.length > 0 && (
        <div className="p-5">
          <h1 className="md:text-3xl font-bold mb-3">
            {resp && <h1>{resp[0].path.split("/")[0]}</h1>}
          </h1>
          <p className="mb-3">{pr(size as number)}</p>
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
      {!err && !isLoading && (
        <>
          <h1 className="text-xl font-bold p-5">Files</h1>
          <div className="p-5">
            {resp?.map((file, i) => {
              return (
                <div
                  key={i}
                  className="p-5 hover:bg-slate-400 duration-200 flex gap-10 cursor-pointer flex-wrap"
                >
                  <h1
                    onClick={() => {
                      open(file.downloadLink, "_blank");
                    }}
                  >
                    {file.name}
                  </h1>
                  <p>{pr(file.size)}</p>
                  {(file.name.endsWith(".mp4") ||
                    file.name.endsWith(".mkv")) && (
                    <button
                      onClick={() => {
                        const url = new URL("/api/playlist", location.origin);
                        url.searchParams.set("streams", file.downloadLink);
                        url.searchParams.set("fileName", file.name);
                        open(url.href);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(file.downloadLink);
                    }}
                  >
                    <FontAwesomeIcon icon={faCopy} /> Copy Stream URL
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
      {isLoading && <h1>Loading files ...</h1>}
      {err && (
        <h1 className="text-red-500">An error occurred while getting files</h1>
      )}
      {resp?.length === 0 && !isLoading && (
        <h1>No files found. It could be 0 seeders</h1>
      )}
    </>
  );
}
