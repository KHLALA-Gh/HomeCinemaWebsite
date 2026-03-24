import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios, { AxiosResponse } from "axios";
import { addDownload } from "../lib/idb";

const endPoint = "/api/torrents/:hash/download";

export function useDownloadTorrent() {
  const [resp, setResp] = useState<AxiosResponse<Download>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const post = async (hash: string, path: string, files?: string[]) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":hash", hash),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.post<any, AxiosResponse<Download>>(url.href, {
      path,
      files,
    });
    if (resp.status === 200) {
      const data: Download = resp.data;
      await addDownload(data);
    }
    return resp;
  };
  const run = (hash: string, path: string, files?: string[]) => {
    setIsLoading(true);
    setErr("");
    setResp(undefined);
    post(hash, path, files)
      .then((data) => {
        setResp(data);
      })
      .catch((err) => {
        setErr(err);
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
    setResp,
  };
}
