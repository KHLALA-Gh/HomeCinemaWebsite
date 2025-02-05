import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function useGetTVShowDetails(showID: string) {
  const [resp, setResp] = useState<TMDBTVShowDetails>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsloading] = useState(true);
  const get = async (showID: string) => {
    const url = new URL("/api/tv_shows/" + showID, location.origin);
    const resp = await axios.get(url.href);
    return resp.data as TMDBTVShowDetails;
  };
  useEffect(() => {
    setIsloading(true);
    get(showID)
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
