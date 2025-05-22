import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios from "axios";

const endPoint = "/api/streams";

export function useCreatePreStream() {
  const [resp, setResp] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const post = async (hash: string, path: string) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    const resp = await axios.post(url.href, {
      hash,
      filePath: path,
    });
    return resp.data;
  };
  useEffect(() => {}, []);
  const fetch = (hash: string, path: string) => {
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
    fetch,
  };
}
