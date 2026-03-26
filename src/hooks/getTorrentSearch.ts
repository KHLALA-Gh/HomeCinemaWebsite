import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import { getMovieStreams, getTvStreams } from "../lib/torrentio";

export const endSearchPoint = "/api/search";

export function useTorrentSearch() {
  const [resp, setResp] = useState<TorrentSearchResp[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<any>();
  const getTorrentio = async (p: TorrentioFetchProps) => {
    if (p.type === "movie") {
      let data = await getMovieStreams(p.imdb_id);
      setResp(
        data.streams.map((t) => {
          return {
            name: t.title,
            infoHash: t.infoHash,
          };
        }),
      );
    } else {
      let data = await getTvStreams(p.imdb_id, p.season, p.episode);
      setResp(
        data.streams.map((t) => {
          return {
            name: t.title,
            infoHash: t.infoHash,
          };
        }),
      );
    }
  };
  const getTorrentAgent = async (query: string, limit?: number) => {
    const config = await fetchConfigs();
    const url = new URL(
      endSearchPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin,
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
  const fetch = (p: FetchProps) => {
    setIsLoading(true);
    setErr(undefined);
    setResp(undefined);
    if (p.op === "torrent-agent") {
      getTorrentAgent(p.query, p.limit)
        .catch((err) => {
          setErr(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (p.op === "torrentio") {
      getTorrentio(p)
        .catch((err) => {
          setErr(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return {
    resp,
    isLoading,
    err,
    setIsLoading,
    fetch,
  };
}

type TorrentioFetchProps =
  | {
      op: "torrentio";
      type: "tv";
      imdb_id: string;
      episode: number;
      season: number;
    }
  | {
      op: "torrentio";
      type: "movie";
      imdb_id: string;
    };
type FetchProps =
  | {
      op: "torrent-agent";
      query: string;
      limit?: number;
    }
  | TorrentioFetchProps;
