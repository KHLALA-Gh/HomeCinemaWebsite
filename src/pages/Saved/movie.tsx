import { useEffect, useState } from "react";
import { MovieDetails } from "../Movie";
import { useParams } from "react-router";
import { getMovieById } from "../../lib/idb";

export default function SavedMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails>();
  const [err, setErr] = useState<string>();
  useEffect(() => {
    if (!id) return;
    if (Number.isInteger(+id)) {
      getMovieById(+id)
        .then((m) => {
          setMovie(m);
        })
        .catch((err) => {
          setErr(err.message);
        });
    }
  }, []);

  return (
    <>
      {!err && <MovieDetails resp={movie} isLoading={movie ? false : true} />}
      {err && <h1 className="text-red-600 text-xl">Error : {err}</h1>}
    </>
  );
}
