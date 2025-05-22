import { useNavigate, useParams, useSearchParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlay, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "../../components/Button/button";
import { useCreatePreStream } from "../../hooks/useCreatePreStream";
import { TorrentFiles } from "../../components/TorrentFiles";
export default function Files() {
  const p = useParams();
  const [showStreamUrl, setShowStreamUrl] = useState(false);
  const [sp, _] = useSearchParams();
  const { resp, isLoading, err, fetch: fetchFiles } = useTorrentFiles();
  const {
    resp: createStreamResp,
    isLoading: isLoadingPreStream,
    err: errPreStream,
  } = useCreatePreStream();
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
  useEffect(() => {
    fetchFiles(p.hash as string);
  }, []);

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

      <TorrentFiles
        resp={resp || []}
        hash={p.hash as string}
        err={err}
        isLoading={isLoading}
      />

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
      {showStreamUrl && (
        <>
          <div className="absolute w-full h-screen bg-[#0000005c] top-0"></div>

          <div className="w-[700px] flex justify-center items-center p-5 border-2 border-white h-[300px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-black">
            {createStreamResp && (
              <div
                className="ms-[90%] translate-x-[-90%] absolute top-5 cursor-pointer"
                onClick={() => setShowStreamUrl(false)}
              >
                <FontAwesomeIcon icon={faX} />
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
                      navigate("/home_cinema/pre-streams");
                    }}
                    className="!text-base ms-[50%] translate-x-[-50%] mt-10"
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
    </>
  );
}
