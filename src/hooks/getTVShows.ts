import axios, { AxiosError } from "axios";
import { useState } from "react";

interface GetTVShowsProps {
  page: string;
}

export const getTVShowsEndPoint = "/api/tv_shows";

export function useGetTVShows(props: GetTVShowsProps) {
  const [resp, setResp] = useState<TVShowsResp>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsloading] = useState(false);
  const get = async (page: string) => {
    const url = new URL(getTVShowsEndPoint, location.origin);
    url.searchParams.set("page", page);
    const resp = await axios.get(url.href);
    return resp.data as TVShowsResp;
  };
  const fetch = () => {
    setIsloading(true);
    get(props.page)
      .then((data) => {
        console.log("first");
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
