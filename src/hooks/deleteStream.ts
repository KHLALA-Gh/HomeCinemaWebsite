import { useEffect, useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios from "axios";

const endPoint = "/api/streams/:id";

export function useDeleteStream() {
  const [resp, setResp] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const del = async (id: string) => {
    const config = await fetchConfigs();
    const url = new URL(
      endPoint.replace(":id", id),
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    const resp = await axios.delete(url.href);
    return resp.data;
  };
  useEffect(() => {}, []);
  const fetch = (id: string) => {
    setIsLoading(true);
    del(id)
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
