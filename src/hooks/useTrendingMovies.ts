import axios, { AxiosError } from "axios";
import { useState } from "react";

interface GetTrendingMoviesProps {
  page: string;
  time: "day" | "week";
}

export function useTrendingMovies() {
  const [resp, setResp] = useState<MoviesResp>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsloading] = useState(false);
  const get = async (time: "day" | "week", page: string) => {
    const url = new URL("/api/movies/trending", location.origin);
    url.searchParams.set("page", page);
    url.searchParams.set("time", time);
    const resp = await axios.get(url.href);
    return resp.data as MoviesResp;
  };
  const fetch = (props: GetTrendingMoviesProps) => {
    setIsloading(true);
    get(props.time, props.page)
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
  };

  return {
    resp,
    err,
    isLoading,
    fetch,
  };
}
