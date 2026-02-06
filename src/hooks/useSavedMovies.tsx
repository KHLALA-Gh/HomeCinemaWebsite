import { useEffect, useState } from "react";
import { getMovies } from "../lib/idb";

export function useSavedMovies() {
  const [savedMv, setSavedMv] = useState<MovieMetaData[]>();
  useEffect(() => {
    getMovies().then((m) => {
      console.log(m);
      setSavedMv(m);
    });
  }, []);
  return savedMv;
}
