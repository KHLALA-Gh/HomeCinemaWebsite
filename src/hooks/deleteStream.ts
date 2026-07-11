import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios, { AxiosResponse } from "axios";

const endPoint = "/api/downloads/:hash";

export function useDeleteDownload() {
  const [resp, setResp] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const del = async (hash: string) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":hash", hash),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.delete(url.href);
    return resp;
  };
  useEffect(() => {}, []);
  const fetch = async (hash: string) => {
    setIsLoading(true);
    try {
      const resp = await del(hash);
      setResp(resp);
      setIsLoading(false);
      return resp as AxiosResponse;
    } catch (err: any) {
      setErr(err.message);
      throw new Error(err);
    }
  };
  return {
    resp,
    isLoading,
    err,
    fetch,
  };
}
