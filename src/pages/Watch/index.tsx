import { useGetYTSList } from "../../hooks/getYTSList";
import Movie, { SaveCard } from "../../components/Movie/Movie";
import NavBar from "../../components/Navbar";
import "./style.css";
import {
  LimitedList,
  MoviesListCategory,
  returnLoadingMovies,
} from "../../components/List";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useSavedMovies } from "../../hooks/useSavedMovies";
import { useTrendingMovies } from "../../hooks/useTrendingMovies";
import { useEffect } from "react";

export default function Watch() {
  const savedMv = useSavedMovies();
  const {
    resp: trendingMovies,
    isLoading: trendingLoading,
    fetch,
  } = useTrendingMovies();

  useEffect(() => {
    fetch({ page: "1", time: "week" });
  }, []);
  return (
    <>
      <NavBar mode="Movies" />

      {savedMv && savedMv.length > 0 && (
        <LimitedList
          resp={savedMv}
          err=""
          isLoading={false}
          listID="saved-mv"
          category="Saved Movies"
          endComponent={<SaveCard />}
        />
      )}

      <div className="md:ps-28 md:pe-28 ps-2">
        <h1 className="font-extrabold text-xl md:text-4xl mb-10 md:mb-20 mt-7 md:mt-20">
          Movies you may like
        </h1>
        <div className="flex flex-wrap justify-center gap-7 md:gap-16 lg:mt-20 ">
          {trendingLoading && (
            <>
              <div className="flex gap-5 justify-center">
                {" "}
                {returnLoadingMovies()}{" "}
              </div>
            </>
          )}
          {!trendingLoading && (
            <>
              {trendingMovies?.results?.map((m, i) => {
                return <Movie key={i} m={m} />;
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
