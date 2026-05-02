import { useNavigate, useParams, useSearchParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlay, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "../../components/Button/button";
import { useCreatePreStream } from "../../hooks/useCreatePreStream";
import { TorrentFiles } from "../../components/TorrentFiles";
import { SaveButton } from "../../components/Movie/Movie";
import {
  addTorrents,
  getTorrentByInfoHash,
  removeTorrent,
} from "../../lib/idb";
import { Back } from "../../components/Utils/back";
import { fetchConfigs } from "../../hooks/getMagnetURI";

interface Streams {
  streamUrl: string;
  name: string;
}

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
  const [streams, setStreams] = useState<Streams[]>();
  const [saved, setSaved] = useState<boolean>(false);
  const [size, setSize] = useState<number>();

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (!p.hash) return;
      let t = await getTorrentByInfoHash(p.hash);
      if (t) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    })();
  }, []);
  useEffect(() => {
    if (!resp) return;
    let size = 0;
    resp?.files.map((file) => {
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
    (async () => {
      const configs = await fetchConfigs();

      let path;
      if (configs.desktopMode) {
        let history = await window.electron.getDH(p.hash as string);
        path = history?.path;
      }
      fetchFiles(p.hash as string, path);
    })();
  }, []);

  return (
    <>
      <div className="p-5">
        <Back />
      </div>

      <TorrentFiles
        resp={resp}
        hash={p.hash as string}
        err={err}
        isLoading={isLoading}
        saved={saved}
        onSave={async () => {
          try {
            if (!p.hash) return;

            if (!saved) {
              let seeders = 0;
              let leechers = 0;
              if (sp.get("seeds")) {
                seeders = Number(sp.get("seeds"));
              }
              if (sp.get("leechers")) {
                leechers = Number(sp.get("leechers"));
              }
              await addTorrents({
                name: resp?.name || "unknown name",
                provider: sp.get("provider") || "unknown provider",
                seeders: seeders,
                leechers: leechers,
                infoHash: p.hash,
                magnetURI: "",
                url: sp.get("about") || "",
              });
              setSaved(true);
            } else {
              await removeTorrent(p.hash);
              setSaved(false);
            }
          } catch (err) {
            console.log(err);
          }
        }}
      />

      <div className="ps-5 mt-7">
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
      </div>
      {err && (
        <h1 className="text-red-500">An error occurred while getting files</h1>
      )}
      {resp?.files.length === 0 && !isLoading && (
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
