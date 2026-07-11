import axios from "axios";
import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";

export const endPoint = "/api/torrents/:hash/files";
export const endPointDownload = "/api/torrents/:hash/files/:path64";

export function useTorrentFiles() {
  const [resp, setResp] = useState<TorrentMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (hash: string, path?: string): Promise<TorrentMetadata> => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":hash", hash),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    if (path) url.searchParams.set("path", path);
    const resp = await axios.get(url.href);
    const data = resp.data as TorrentMetadata;
    for (let file of data.files as TorrentFile[]) {
      const url = new URL(
        endPointDownload.replace(":hash", hash).replace(":path64", file.path64),
        config["torrent-streamer-api"].external
          ? config["torrent-streamer-api"].origin
          : location.origin,
      );
      file.downloadLink = url.href;
    }
    return data;
  };
  const fetch = (hash: string, path?: string) => {
    setIsLoading(true);
    setErr("");
    get(hash, path)
      .then((data) => {
        setResp(data);
      })
      .catch((err) => {
        console.log(err);
        setErr(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    resp,
    isLoading,
    err,
    fetch,
  };
}
