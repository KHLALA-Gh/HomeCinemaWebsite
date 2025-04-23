import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";

export const endSearchPoint = "/api/search";

export function useTorrentSearch() {
  const [resp, setResp] = useState<TorrentSearch[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (query: string, limit?: number) => {
    const config = await fetchConfigs();
    const url = new URL(
      endSearchPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    url.searchParams.set("query", query);
    url.searchParams.set("limit", `${limit}`);
    const source = new EventSource(url.href);
    console.log("send");
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setResp((d) => {
          return d ? [...d, data] : [data];
        });
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    };

    source.onerror = (error) => {
      console.error("EventSource failed:", error);
      source.close();
    };
  };
  const fetch = (query: string, limit?: number) => {
    setIsLoading(true);
    setResp(undefined);
    get(query, limit)
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
