import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios from "axios";

const endPoint = "/api/downloads";

export function useGetDownloads() {
  const [resp, setResp] = useState<Download[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async () => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.get(url.href);
    return resp.data as Download[];
  };
  useEffect(() => {}, []);
  const fetch = () => {
    setErr(undefined);
    setIsLoading(true);
    get()
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
    setResp,
  };
}
