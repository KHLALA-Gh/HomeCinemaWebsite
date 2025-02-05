import { useNavigate } from "react-router";

export default function Show(props: TMDBTVShow) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        console.log("wa");
        navigate("/home_cinema/tv_shows/" + props.id);
      }}
      style={{
        backgroundImage: `url("https://media.themoviedb.org/t/p/w300_and_h450_bestv2${props.poster_path})`,
      }}
      className="lg:w-[230px] duration-500 ease-out tv_show w-[115px] h-[172px] relative lg:h-[345px] shrink-0 cursor-pointer rounded-md"
    >
      <div className="flex flex-col gap-5 h-full items-center justify-center opacity-0 hover:opacity-100 duration-300 bg-[#000000a3]">
        <h1 className="text-center font-bold md:text-base text-sm lg:text-xl">
          {props.name}
        </h1>
        <h3 className="lg:text-base text-center">
          Date : {props.first_air_date}
        </h3>
        <h3>Rating : {props.vote_average}</h3>
      </div>
    </div>
  );
}
