import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useParams, useSearchParams } from "react-router";
import {
  fetchConfigs,
  streamEndPoint,
  useGetMagnetURI,
} from "../../hooks/getMagnetURI";
import { useEffect, useState } from "react";
export default function Play() {
  const p = useParams();
  const {
    resp: magnet,
    err,
    isLoading,
    setErr,
  } = useGetMagnetURI(p.hash as string);
  const [sp, _] = useSearchParams();
  const [streamUrl, setStreamUrl] = useState<string>();
  useEffect(() => {
    fetchConfigs()
      .then((c) => {
        const url = new URL(
          streamEndPoint,
          c["torrent-streamer-api"].external
            ? c["torrent-streamer-api"].origin
            : location.origin
        );
        url.searchParams.set("magnet", magnet);
        let path64 = sp.get("path64");
        if (path64) {
          url.searchParams.set("path64", path64);
        }
        setStreamUrl(url.href);
      })
      .catch(() => {
        setErr("error when fetching configs");
      });
  }, [magnet]);
  return (
    <>
      {!isLoading && !err && streamUrl && (
        <MediaPlayer
          src={{
            src: streamUrl,
            type:
              sp.get("vd_type") == "mp4" || !sp.get("vd_type")
                ? "video/mp4"
                : "video/webm",
          }}
          onError={(e) => {
            setErr(e.message);
          }}
          autoPlay={true}
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      )}
      {err && (
        <div className="bg-red-500">
          <h1 className="text-white text-xl">{err}</h1>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center w-full h-screen">
          <h1 className="text-2xl">Getting Magnet URI</h1>
        </div>
      )}
    </>
  );
}
