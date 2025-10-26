import { useEffect, useState } from "react";
import { getMovies, getTVShows } from "../../lib/idb";
import Movie from "../../components/Movie/Movie";
import Show from "../../components/Show";

type dataCode = "mv" | "tv" | "tr";
interface typeData {
  name: string;
  code: dataCode;
}

const data: typeData[] = [
  {
    name: "Movie",
    code: "mv",
  },
  {
    name: "TV Show",
    code: "tv",
  },
  {
    name: "Torrents",
    code: "tr",
  },
];

export default function Saved() {
  const [selectedData, setSelectedData] = useState<dataCode>("mv");
  const [mvDetails, setMvDetails] = useState<MovieDetails[]>();
  const [tvShows, setTVShow] = useState<TMDBTVShowDetails[]>();
  useEffect(() => {
    if (selectedData === "mv") {
      getMovies().then((m) => {
        setMvDetails(m);
      });
    } else if (selectedData === "tv") {
      getTVShows().then((tv) => {
        setTVShow(tv);
      });
    }
  }, [selectedData]);
  return (
    <>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Offline Saved Data</h1>
        <div className="flex gap-5 text-sm mt-5 mb-5">
          {data.map((d, i) => {
            return (
              <div
                key={i}
                onClick={() => setSelectedData(d.code)}
                className={
                  `cursor-pointer` +
                  (selectedData === d.code
                    ? " underline-offset-2 underline font-bold"
                    : "")
                }
              >
                <p>{d.name}</p>
              </div>
            );
          })}
        </div>
        {selectedData === "mv" ? (
          <div className="flex gap-5 flex-wrap">
            {mvDetails?.map((m, i) => {
              return (
                <Movie
                  key={i}
                  to={`/home_cinema/saved/movies/${m.id}`}
                  m={{
                    id: m.id,
                    title: m.title,
                    year: m.year,
                    rating: m.rating,
                    medium_cover_image: m.medium_cover_image,
                    runtime: m.runtime?.toString(),
                  }}
                />
              );
            })}
            {mvDetails?.length === 0 && (
              <CenteredMessage msg="No saved movies" />
            )}
          </div>
        ) : selectedData === "tv" ? (
          <div className="flex gap-5 flex-wrap">
            {tvShows?.map((m, i) => {
              return (
                <Show
                  key={i}
                  to={`/home_cinema/saved/show/${m.id}`}
                  show={{
                    id: m.id,
                    name: m.name,
                    first_air_date: m.first_air_date,
                    vote_average: m.vote_average,
                    poster_path: m.poster_path,
                    backdrop_path: m.backdrop_path,
                    origin_country: m.origin_country,
                    genre_ids: [],
                  }}
                />
              );
            })}
            {tvShows?.length === 0 && (
              <CenteredMessage msg="No saved TV shows" />
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

function CenteredMessage({ msg }: { msg: string }) {
  return (
    <div className="flex opacity-50 justify-center items-center w-full h-screen absolute top-0 left-0 -z-10">
      <h1>{msg}</h1>
    </div>
  );
}
