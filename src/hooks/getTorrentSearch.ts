import axios from "axios";
import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";

export const endSearchPoint = "/api/search";

export function useTorrentSearch() {
  const [resp, setResp] = useState<TorrentSearch[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (
    query: string,
    limit?: number
  ): Promise<TorrentSearch[]> => {
    const config = await fetchConfigs();
    const url = new URL(
      endSearchPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    url.searchParams.set("query", query);
    url.searchParams.set("limit", `${limit || 20}`);
    url.searchParams.set("category", "TV");
    const resp = await axios.get(url.href);
    return resp.data as TorrentSearch[];
  };
  const fetch = (query: string, limit?: number) => {
    setIsLoading(true);
    get(query, limit)
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
