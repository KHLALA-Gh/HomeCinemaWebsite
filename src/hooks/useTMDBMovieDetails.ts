import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export async function getMovieDetails(
  movieID: string,
): Promise<TMDBMovieDetails> {
  const url = new URL("/api/movies/" + movieID, location.origin);
  const resp = await axios.get(url.href);
  return resp.data as TMDBMovieDetails;
}

export function useTMDBMovieDetails(movieID: string) {
  const [resp, setResp] = useState<TMDBMovieDetails>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsloading] = useState(true);
  const get = async (movieID: string) => {
    const url = new URL("/api/movies/" + movieID, location.origin);
    const resp = await axios.get(url.href);
    return resp.data as TMDBMovieDetails;
  };
  useEffect(() => {
    setIsloading(true);
    get(movieID)
      .then((data) => {
        setResp(data);
      })
      .catch((e: Error) => {
        if (e instanceof AxiosError) {
          setErr(e.response?.data.error);
          return;
        }
        setErr(e.message);
      })
      .finally(() => {
        setIsloading(false);
      });
  }, []);
  return {
    resp,
    err,
    isLoading,
  };
}
