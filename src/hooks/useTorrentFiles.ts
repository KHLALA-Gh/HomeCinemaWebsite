import axios from "axios";
import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";

export const endPoint = "/api/torrents/:hash/files";
export const endPointDownload = "/api/torrents/:hash/files/:path64";

export function useTorrentFiles(hash: string) {
  const [resp, setResp] = useState<TorrentFile[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (hash: string): Promise<TorrentFile[]> => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":hash", hash),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    const resp = await axios.get(url.href);
    for (let file of resp.data as TorrentFile[]) {
      const url = new URL(
        endPointDownload.replace(":hash", hash).replace(":path64", file.path64),
        config["torrent-streamer-api"].external
          ? config["torrent-streamer-api"].origin
          : location.origin
      );
      file.downloadLink = url.href;
    }
    return resp.data as TorrentFile[];
  };
  useEffect(() => {
    setIsLoading(true);
    get(hash)
      .then((data) => {
        setResp(data);
      })
      .catch((err) => {
        setErr(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return {
    resp,
    isLoading,
    err,
  };
}
