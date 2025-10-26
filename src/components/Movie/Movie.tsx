import { faStar, faStopwatch } from "@fortawesome/free-solid-svg-icons";

import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addMovie, getMovieById, removeMovie } from "../../lib/idb";
import { getMovieDetails } from "../../hooks/getMoviesDetails";
import { useEffect, useState } from "react";

export default function Movie({
  m,
  loading,
  to,
}: {
  m?: MovieMetaData;
  loading?: boolean;
  to?: string;
}) {
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    if (m?.id) {
      getMovieById(m.id).then((mov) => {
        if (mov) {
          setSaved(true);
        }
      });
    }
  }, []);
  return (
    <>
      {!loading && m && (
        <div
          className="lg:w-[230px] rounded-xl overflow-hidden w-[115px] h-[172px] relative lg:h-[345px] shrink-0 cursor-pointer"
          style={{
            backgroundImage: `url("${m.medium_cover_image}")`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full backdrop-blur-sm opacity-0 hover:opacity-100 relative pt-10 bg-[#0000009c] duration-300">
            <div
              onClick={async () => {
                if (!saved) {
                  const md = await getMovieDetails(m.id);
                  await addMovie(md);
                  setSaved(true);
                } else {
                  await removeMovie(m.id);
                  setSaved(false);
                }
              }}
              className={
                "absolute top-2 left-2 border-2 rounded-full w-8 h-8 flex justify-center items-center " +
                (saved ? "border-yellow-500" : "border-white")
              }
            >
              <FontAwesomeIcon
                /*@ts-ignore*/

                icon={faBookmark}
                color={`${saved ? "yellow" : "white"}`}
              />
            </div>
            <div
              onClick={() => {
                location.href = to || "/home_cinema/watch/" + m.id;
              }}
            >
              <h1 className="text-center text-sm lg:text-lg mt-5  font-bold lg:overflow-auto overflow-hidden text-nowrap lg:text-wrap">
                {m.title}
              </h1>
              <div className="flex flex-col-reverse gap-2 md:mt-5 justify-center">
                <h1 className="font-extrabold text-center text-sm lg:text-lg">
                  {m.rating} / 10{" "}
                </h1>{" "}
                <FontAwesomeIcon icon={faStar} className="h-3 lg:h-5" />
              </div>
              <div className="flex justify-center items-center gap-1 mt-5">
                <FontAwesomeIcon icon={faStopwatch} className="h-3 lg:h-5" />
                <h1 className="text-sm lg:text-lg">{m.runtime} min</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="lg:w-[230px] w-[115px] h-[172px] relative lg:h-[345px] shrink-0 loading-background"></div>
      )}
    </>
  );
}
