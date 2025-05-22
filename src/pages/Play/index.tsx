import ReactPlayer from "react-player";
import { useParams, useSearchParams } from "react-router";
import { fetchConfigs, streamEndPoint } from "../../hooks/getMagnetURI";
import { useEffect, useState } from "react";
export default function Play() {
  const p = useParams();
  const [sp, _] = useSearchParams();
  const [streamUrl, setStreamUrl] = useState<string>();
  const [err, setErr] = useState<string>();
  useEffect(() => {
    fetchConfigs()
      .then((c) => {
        const url = new URL(
          streamEndPoint,
          c["torrent-streamer-api"].external
            ? c["torrent-streamer-api"].origin
            : location.origin
        );
        url.searchParams.set("hash", p.hash as string);
        let path64 = sp.get("path64");
        if (path64) {
          url.searchParams.set("path64", path64);
        }
        setStreamUrl(url.href);
      })
      .catch(() => {
        setErr("error when fetching configs");
      });
  }, [p]);
  return (
    <>
      {!err && streamUrl && (
        <ReactPlayer
          light={
            <img
              src={sp.get("thumbnail") || ""}
              width={"100%"}
              height={"100vh"}
              alt="Thumbnail"
            />
          }
          width={"100%"}
          height={"100%"}
          url={streamUrl}
          controls
        />
      )}
      {err && (
        <div className="bg-red-500">
          <h1 className="text-white text-xl">{err}</h1>
        </div>
      )}
    </>
  );
}
