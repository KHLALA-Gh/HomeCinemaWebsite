import axios from "axios";
import { useEffect, useState } from "react";

export function useTorrentioMovies() {
  const [resp, setResp] = useState<TorrentioResp>();
  const [isLoading, setIsloading] = useState(false);
  const [err, setErr] = useState();
  const get = async (imdb_id: string) => {
    const url = `https://torrentio.strem.fun/stream/movie/${imdb_id}.json`;
    const res = await axios.get(url);
    return res.data as TorrentioResp;
  };
  const fetch = (imdb_id: string) => {
    setIsloading(true);
    get(imdb_id)
      .then((d) => {
        setResp(d);
      })
      .catch((err) => setErr(err))
      .finally(() => setIsloading(false));
  };
  return { resp, isLoading, err, fetch };
}
