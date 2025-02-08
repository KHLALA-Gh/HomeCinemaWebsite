import Button from "../Button/button";
import { useTorrentSearch } from "../../hooks/getTorrentSearch";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function getMagnetHash(magnetLink: string) {
  const url = new URL(magnetLink);
  const params = new URLSearchParams(url.search);
  const xt = params.get("xt");
  if (xt && xt.startsWith("urn:btih:")) {
    return xt.replace("urn:btih:", "");
  }
  return null;
}

export function ShowDetails(props: TMDBTVShowDetails) {
  const { resp, err, isLoading, fetch } = useTorrentSearch();
  const navigate = useNavigate();
  const search = () => {
    //@ts-ignore
    let season = document.getElementById("season")?.value;
    //@ts-ignore
    let limit = document.getElementById("limit")?.value;

    if (season) {
      fetch(`${props.name} S0${season}`, limit);
    }
  };
  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-7 mb-5" />
      </div>
      <div className="lg:flex gap-20 relative">
        <div className="z-10 min-w-[300px] min-h-[450px]">
          <img
            className={"w-[300px] h-[450px]"}
            src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${props.poster_path}`}
          />
        </div>
        <div className={"blur-[100px] absolute z-[-10] top-0"}>
          <img
            src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${props.poster_path}`}
            alt=""
          />
        </div>
        <div className="z-10 mb-10">
          <h1 className="text-4xl font-extrabold">{props.name}</h1>
          <h1 className="text-xl font-semibold mt-3">
            {props.seasons.length} Season{props.seasons.length > 1 ? "s" : ""}
          </h1>
          <h1 className="text-lg mt-2">
            Genres :{" "}
            {props.genres.map((g, i) => {
              if (i === props.genres.length - 1) {
                return g.name;
              }
              return g.name + " / ";
            })}
          </h1>
          <h1 className="text-lg">Rating :{props.vote_average}</h1>
          <p className="mt-7 text-lg">{props.overview}</p>
          <select name="" id="season" className="mt-5 mr-2">
            {props.seasons.map((s, i) => {
              if (s.name === "Specials") return;
              return (
                <option value={s.season_number} key={i}>
                  {s.name}
                </option>
              );
            })}
          </select>
          Search Limit{" "}
          <select name="" id="limit" className="mr-2">
            <option value="10">10</option>
            <option value="20" selected>
              20
            </option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="60">60</option>
            <option value="70">70</option>
          </select>
          <Button
            onClick={search}
            className="!text-base !pr-7 !ps-7 !pt-2 !pb-2 mt-3"
          >
            Search
          </Button>
        </div>
      </div>
      <div>
        {isLoading && <div>Loading...(it takes time !)</div>}
        {!isLoading && !err && resp && (
          <>
            <h1 className="text-2xl font-bold mb-5">Torrents Found</h1>
            {resp?.map((t, i) => {
              return (
                <div
                  className="p-5 hover:bg-slate-400 duration-200 cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/home_cinema/torrents/${getMagnetHash(
                        t.magnetURI
                      )}/files?about=${t.desc}&seeds=${t.seeds}&peers=${
                        t.peers
                      }`
                    );
                  }}
                  key={i}
                >
                  {t.title}
                </div>
              );
            })}
            {resp.length === 0 && <h1>No Torrents Found :(</h1>}
          </>
        )}
      </div>
    </>
  );
}
