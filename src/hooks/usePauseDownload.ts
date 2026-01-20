import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios from "axios";

const endPoint = "/api/downloads";

export function usePauseDownload() {
  const [resp, setResp] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const put = async (hash: string) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.put(url.href, { hash });
    return resp.data;
  };
  useEffect(() => {}, []);
  const fetch = (hash: string) => {
    setIsLoading(true);
    put(hash)
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
    fetch,
  };
}
