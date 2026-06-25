import axios from "axios";
import { useEffect, useState } from "react";

const detailsEndPoint = "https://movies-api.accel.li/api/v2/movie_details.json";

export async function getMovieDetails(imdb_id: number) {
  const url = new URL(detailsEndPoint);
  url.searchParams.set("imdb_id", `${imdb_id}`);
  url.searchParams.set("with_images", `true`);
  const resp = await axios.get(url.href);
  if (resp.status === 200 && resp.data.status === "ok") {
    let m: MovieDetails = resp.data.data.movie;
    return m;
  } else {
    if (resp.data.error === "error") {
      throw resp.data.status_message;
    }
    throw "unexpected error while getting movie details";
  }
}

export function useGetYTSMovieDetails(imdb_id: string) {
  const [resp, setResp] = useState<MovieDetails>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const get = async (url: string) => {
    const resp = await axios.get(url);
    if (resp.status === 200 && resp.data.status === "ok") {
      let m: MovieDetails = resp.data.data.movie;
      setResp(m);
    } else {
      if (resp.data.error === "error") {
        setErr(resp.data.status_message);
        return;
      }
      setErr("unexpected error while getting movie details");
    }
  };
  const fetch = () => {
    setIsLoading(true);
    const url = new URL(detailsEndPoint);
    url.searchParams.set("imdb_id", imdb_id);
    get(url.href)
      .catch((e) => {
        setErr(e);
      })
      .finally(() => setIsLoading(false));
  };

  return {
    resp,
    err,
    isLoading,
    fetch,
  };
}
