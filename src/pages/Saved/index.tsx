import { useEffect, useState } from "react";
import { addMovie, getMovies } from "../../lib/idb";
import Movie from "../../components/Movie/Movie";

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
  useEffect(() => {
    if (selectedData === "mv") {
      getMovies().then((m) => {
        setMvDetails(m);
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
              console.log({
                id: m.id,
                title: m.title,
                year: m.year,
                rating: m.rating,
                medium_cover_image: m.medium_cover_image,
                runtime: m.runtime,
              });
              return (
                <Movie
                  key={i}
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
          </div>
        ) : selectedData === "tv" ? (
          <div></div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
