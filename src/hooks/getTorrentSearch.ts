import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";

export const endSearchPoint = "/api/search";

export function useTorrentSearch() {
  const [resp, setResp] = useState<TorrentSearch[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<any>();
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

    await new Promise<void>((res, rej) => {
      const source = new EventSource(url.href);
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
        rej(error);
      };

      source.addEventListener("close", (e) => {
        console.log("Server sent close event:", e.data);
        res();
        source.close();
      });
    });
  };
  const fetch = (query: string, limit?: number) => {
    setIsLoading(true);
    setErr(undefined);
    setResp(undefined);
    get(query, limit)
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
    fetch,
  };
}
