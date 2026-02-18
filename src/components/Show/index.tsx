import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { addTVShow, getTVShowById, removeTVShow } from "../../lib/idb";
import { SaveButton } from "../Movie/Movie";

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
    <>
      <div
        style={{
          backgroundImage: `url("https://media.themoviedb.org/t/p/w300_and_h450_bestv2${show.poster_path})`,
        }}
        className="lg:w-[230px] duration-500 ease-out tv_show w-[115px] h-[172px] relative lg:h-[345px] shrink-0 cursor-pointer rounded-md overflow-hidden"
      >
        <div className="inset-shadow-sm/40 shadow-2xl rounded-md border border-white/10 inset-shadow-white/70 bg-black/40 backdrop-blur-xs opacity-0 hover:opacity-100 duration-300 flex items-center h-full justify-center">
          <SaveButton
            onClick={async () => {
              if (!saved) {
                await addTVShow(show);
                setSaved(true);
              } else {
                await removeTVShow(show.id);
                setSaved(false);
              }
            }}
            saved={saved}
            className="absolute! md:top-2 top-0 left-0 md:left-2 md:scale-100! scale-75"
          />
          <div
            onClick={() => {
              navigate(to || "/home_cinema/tv_shows/" + show.id);
            }}
            className="flex mt-7 flex-col gap-5 h-full items-center justify-center"
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
    </>
  );
}
