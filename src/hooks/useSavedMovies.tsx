import { useEffect, useState } from "react";
import { getMovies } from "../lib/idb";

export function useSavedMovies() {
  const [savedMv, setSavedMv] = useState<MovieSavedData[]>();
  useEffect(() => {
    getMovies().then((m) => {
      setSavedMv(m);
    });
  }, []);
  return savedMv;
}
