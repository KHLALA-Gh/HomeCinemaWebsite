import axios from "axios";
import { useEffect, useState } from "react";

const listEndPoint = "https://movies-api.accel.li/api/v2/list_movies.json";

interface GetYTSListProps {
  queries?: string[][];
  fetchWhenCall?: boolean;
}

export function useGetYTSList(props: GetYTSListProps) {
  if (props.fetchWhenCall === undefined) {
    props.fetchWhenCall = true;
  }
  const [resp, setResp] = useState<MovieMetaData[]>();
  const [err, setErr] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const getList = async (url: string) => {
    const resp = await axios.get(url);
    if (resp.status == 200 && resp.data.status === "ok") {
      if (resp.data.data.movie_count == 0) {
        setErr("movie not found :(");
        return;
      }
      let movies: MovieMetaData[] = resp.data.data.movies;
      setResp([]);
      for (let m of movies) {
        setResp((p): MovieMetaData[] => {
          const n: MovieMetaData = {
            id: m.id,
            title: m.title,
            year: m.year,
            rating: m.rating,
            runtime: m.runtime,
            medium_cover_image: m.medium_cover_image,
          };
          if (!p) {
            return [n];
          }
          return [...p, n];
        });
      }
    } else {
      setErr(resp.data.error);
    }
  };
  const fetch = (queries?: string[][]) => {
    const url = new URL(listEndPoint);
    if (queries) {
      for (let q of queries) {
        url.searchParams.set(q[0], q[1]);
      }
    }
    getList(url.href)
      .catch((e) => {
        if (typeof e.err === "string") {
          setErr(e.err);
        } else {
          setErr("unexpected error while getting movies list");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  if (props.fetchWhenCall) {
    useEffect(() => {
      fetch(props.queries);
    }, []);
  }
  return { resp, isLoading, err, fetch };
}
