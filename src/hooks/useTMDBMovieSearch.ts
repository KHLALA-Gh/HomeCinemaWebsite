import { useState } from "react";
import axios from "axios";

export const movieEndPoint = "/api/movies/search/";

export function useSearchMovies() {
  const [resp, setResp] = useState<MoviesResp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>();
  const get = async (query: string, page: string): Promise<MoviesResp> => {
    const url = new URL(movieEndPoint, location.origin);
    url.searchParams.set("query", query);
    url.searchParams.set("page", page);
    const resp = await axios.get(url.href);
    return resp.data as MoviesResp;
  };
  const fetch = (query: string, page: string) => {
    setIsLoading(true);
    get(query, page)
      .then((data) => {
        setResp(data);
      })
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
