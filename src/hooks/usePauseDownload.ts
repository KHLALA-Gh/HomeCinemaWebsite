import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios, { AxiosResponse } from "axios";

const endPoint = "/api/downloads";

export function usePauseDownload() {
  const [resp, setResp] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const put = async (hash: string, stop?: boolean): Promise<AxiosResponse> => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.put(url.href, { hash, stop });
    return resp;
  };
  const fetch = async (
    hash: string,
    stop?: boolean,
  ): Promise<AxiosResponse> => {
    setIsLoading(true);
    try {
      const data = await put(hash, stop);
      setResp(data);
      setIsLoading(false);

      return data;
    } catch (err: any) {
      setErr(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  return {
    resp,
    isLoading,
    err,
    fetch,
  };
}
