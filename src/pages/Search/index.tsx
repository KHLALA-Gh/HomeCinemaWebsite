import { useNavigate, useSearchParams } from "react-router";
import { returnLoadingMovies } from "../../components/List";
import { useEffect } from "react";
import Movie from "../../components/Movie/Movie";
import { useSearchMovies } from "../../hooks/useTMDBMovieSearch";

export default function Search() {
  const [searchP] = useSearchParams();
  const { resp, err, isLoading, fetch } = useSearchMovies();
  const nav = useNavigate();
  useEffect(() => {
    let t = searchP.get("term");
    if (!t) nav("/home_cinema/watch");
    fetch(searchP.get("term") as string, "1");
  }, [searchP]);
  return (
    <>
      <div className="md:ps-28 md:pe-28 ps-3 pr-3 mt-10 md:mt-20 mb-20">
        <h1 className="md:text-4xl text-xl mb-10 md:mb-20 font-extrabold">
          Movies
        </h1>
        {err && <h1 className="text-red-500">Error when searching : {err}</h1>}
        {isLoading && !err && (
          <>
            <div className="flex gap-5 justify-center">
              {" "}
              {returnLoadingMovies()}{" "}
            </div>
          </>
        )}
        {!isLoading && !err && (
          <>
            <div className="flex gap-4 md:gap-16 flex-wrap justify-center">
              {resp?.results?.map((m, i) => {
                return <Movie key={i} m={m} />;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
