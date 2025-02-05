import { useState } from "react";
import { fetchConfigs } from "./getMagnetURI";
import axios from "axios";

export const tvSearchEndPoint = "/api/tv_shows/search/";

export function useSearchTVShows() {
  const [resp, setResp] = useState<TVShowsResp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (query: string, page: string): Promise<TVShowsResp> => {
    const config = await fetchConfigs();
    const url = new URL(
      tvSearchEndPoint,
      config["torrent-streamer-api"].external
        ? config["torrent-streamer-api"].origin
        : location.origin
    );
    url.searchParams.set("query", query);
    url.searchParams.set("page", page);
    const resp = await axios.get(url.href);
    return resp.data as TVShowsResp;
  };
  const fetch = (query: string, page: string) => {
    setIsLoading(true);
    get(query, page)
      .then((data) => {
        setResp(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
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
