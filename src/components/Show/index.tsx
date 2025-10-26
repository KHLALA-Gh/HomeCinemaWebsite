import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { addTVShow, getTVShowById, removeTVShow } from "../../lib/idb";
import { getTVShowDetails } from "../../hooks/getTVShowDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

export default function Show({ show, to }: { show: TMDBTVShow; to?: string }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    getTVShowById(show.id).then((t) => {
      if (t) {
        setSaved(true);
      }
    });
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url("https://media.themoviedb.org/t/p/w300_and_h450_bestv2${show.poster_path})`,
      }}
      className="lg:w-[230px] duration-500 ease-out tv_show w-[115px] h-[172px] relative lg:h-[345px] shrink-0 cursor-pointer rounded-md"
    >
      <div className=" opacity-0 hover:opacity-100 duration-300 bg-[#000000a3] flex items-center h-full justify-center">
        <div
          onClick={async () => {
            if (!saved) {
              const tvShow = await getTVShowDetails(show.id);
              await addTVShow(tvShow);
              setSaved(true);
            } else {
              await removeTVShow(show.id);
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
            navigate(to || "/home_cinema/tv_shows/" + show.id);
          }}
          className="flex flex-col gap-5 h-full items-center justify-center"
        >
          <h1 className="text-center font-bold md:text-base text-sm lg:text-xl">
            {show.name}
          </h1>
          <h3 className="lg:text-base text-center">
            Date : {show.first_air_date}
          </h3>
          <h3>Rating : {show.vote_average}</h3>
        </div>
      </div>
    </div>
  );
}
