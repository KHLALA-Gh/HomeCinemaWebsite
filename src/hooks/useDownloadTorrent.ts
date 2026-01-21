import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios, { AxiosResponse } from "axios";
import { addDownload } from "../lib/idb";

const endPoint = "/api/torrents/:hash/download";

export function useDownloadTorrent() {
  const [resp, setResp] = useState<AxiosResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const post = async (hash: string, path: string) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":hash", hash),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.post(url.href, {
      path,
    });
    if (resp.status === 200) {
      const data: Download = resp.data;
      console.log(data);
      await addDownload(data);
    }
    return resp;
  };
  const run = (hash: string, path: string) => {
    setIsLoading(true);
    setErr("");
    setResp(undefined);
    post(hash, path)
      .then((data) => {
        setResp(data);
      })
      .catch((err) => {
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
    run,
  };
}
