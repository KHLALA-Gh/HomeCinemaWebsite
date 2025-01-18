import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface GetTVShowsProps {
  page: string;
}

export function useGetTVShows(props: GetTVShowsProps) {
  const [resp, setResp] = useState<TVShowsResp>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsloading] = useState(true);
  const get = async (page: string) => {
    const url = new URL("/api/tv_shows", location.origin);
    url.searchParams.set("page", page);
    const resp = await axios.get(url.href);
    return resp.data as TVShowsResp;
  };
  useEffect(() => {
    setIsloading(true);
    get(props.page)
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
