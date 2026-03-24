import { useTorrentSearch } from "../../hooks/getTorrentSearch";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faExclamationCircle,
  faMousePointer,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { SaveButton } from "../Movie/Movie";
import Btn from "../Button/button";
import {
  addTorrents,
  addTVShow,
  getTorrentByInfoHash,
  getTVShowById,
  removeTorrent,
  removeTVShow,
} from "../../lib/idb";
import { Input } from "@mui/joy";
import { Back } from "../Utils/back";

export function ShowDetails(props: TMDBTVShowDetails) {
  const { resp, err, isLoading, fetch } = useTorrentSearch();
  const [selectedSeason, setSelectedSeason] = useState<number>();
  const [searchOption, setSearchOption] = useState<"text" | "select">("select");
  const [query, setQuery] = useState<string>(`${props.name} S01`);
  const [selectedEp, setSelectedEp] = useState<number>();
  const [limit, setLimit] = useState<number>(10);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const navigate = useNavigate();
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    console.log(props.seasons);
    getTVShowById(props.id).then((t) => {
      if (t) {
        setSaved(true);
      }
    });
  }, []);
  const search = () => {
    if (searchOption === "text") {
      fetch(query, limit);

      return;
    }
    //@ts-ignore
    let season = document.getElementById("season")?.value;
    //@ts-ignore
    let ep = document.getElementById("ep")?.value;
    let req = `${props.name}`;
    if (selectedSeason) {
      req += ` S0${selectedSeason}`;
    }
    if (selectedEp) {
      req += `E0${selectedEp}`;
    }

    fetch(req, limit);
  };
  useEffect(() => {
    let season = document.getElementById("season");

    if (season) {
      season.onchange = () => {
        //@ts-ignore
        setSelectedSeason(season.value);
      };
    }
  }, [resp]);
  return (
    <>
      <div className="mb-10 z-20">
        <Back />
      </div>
      <div className="lg:flex gap-20 relative z-50">
        <div className="lg:z-10 left-[50%] lg:top-0 top-[20%] lg:left-0 lg:translate-x-0 translate-x-[-50%] z-[-10] lg:relative w-fit absolute min-w-[300px] min-h-[450px] rounded-md">
          <div className="rounded-md overflow-hidden w-fit">
            <img
              className={"w-[300px] h-[450px]"}
              src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${props.poster_path}`}
            />
          </div>
          <div className="rounded-lg absolute top-0 bg-gradient-to-t from-[#000000] to-[#00000086] w-full h-full z-30 block lg:hidden"></div>
          <div
            className={"blur-[100px] opacity-50 absolute z-[-10] top-[-50px]"}
          >
            <img
              src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${props.poster_path}`}
              alt=""
            />
          </div>
        </div>

        <div className="z-10 mb-10">
          <div className="flex sm:flex-row flex-col sm:items-center gap-3">
            <h1 className="text-4xl font-extrabold">{props.name}</h1>
            <SaveButton
              onClick={async () => {
                if (!saved) {
                  await addTVShow({
                    id: props?.id,
                    name: props?.name,
                    vote_average: props.vote_average,
                    backdrop_path: props.backdrop_path,
                    genre_ids: [],
                    origin_country: props.origin_country,
                    poster_path: props.poster_path,
                    first_air_date: props.first_air_date,
                  });
                  setSaved(true);
                } else {
                  await removeTVShow(props.id);
                  setSaved(false);
                }
              }}
              saved={saved}
            />
          </div>
          <h1 className="text-xl font-semibold mt-3">
            {props.seasons.filter((s) => s.name !== "Specials").length} Season
            {props.seasons.filter((s) => s.name !== "Specials").length > 1
              ? "s"
              : ""}
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
          <p className="mt-7 text-base md:text-lg">{props.overview}</p>
          <div
            onClick={() =>
              setSearchOption(searchOption === "text" ? "select" : "text")
            }
            className="bg-pop mt-3 cursor-pointer relative flex justify-between rounded-full w-fit bg-white/10 pt-2 pb-2 ps-3 pr-3 gap-5"
          >
            <div>
              <FontAwesomeIcon icon={faMousePointer} />
            </div>
            <div>
              <FontAwesomeIcon icon={faPen} />
            </div>
            <div
              className={`absolute h-[100%] w-[50%] top-0 rounded-full duration-200 ease-in-out h-5 ${searchOption === "select" ? "left-0" : "left-full translate-x-[-100%]"} bg-white/30`}
            ></div>
          </div>
          <div className="flex flex-wrap items-center mt-5">
            {searchOption === "select" && (
              <>
                <div>
                  <p>Season </p>
                  <Select
                    onChange={(_, v) => {
                      if (typeof v !== "number") return;
                      if (v == 0) {
                        setSelectedEp(0);
                      }
                      setSelectedSeason(v);
                    }}
                    placeholder="Choose one…"
                    name=""
                    id="season"
                    className=" mr-2 !bg-[#151515] !text-white after:bg-black !w-[150px]"
                    sx={{
                      padding: 0,
                      paddingLeft: "10px",
                    }}
                  >
                    <Option
                      className="!bg-[#000000] !text-white !border-0 hover:!bg-[#242424]"
                      value={0}
                    >
                      any
                    </Option>
                    {props.seasons.map((s, i) => {
                      if (s.name === "Specials") return;

                      return (
                        <Option
                          className="!bg-[#000000] !text-white !border-0 hover:!bg-[#242424]"
                          value={s.season_number}
                          key={i}
                        >
                          {s.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <p>Episode </p>
                  <Select
                    disabled={!selectedSeason}
                    onChange={(_, v) => {
                      if (typeof v !== "number") return;
                      setSelectedEp(v);
                    }}
                    placeholder="Choose one…"
                    name=""
                    id="ep"
                    className="mr-2 !bg-[#151515] !text-white after:bg-black !w-[150px]"
                    sx={{
                      padding: 0,
                      paddingLeft: "10px",
                      "&.Mui-disabled": {
                        backgroundColor: "#000 !important",
                        color: "#797979 !important",
                        border: "2px solid #ccc",
                      },
                    }}
                  >
                    <Option
                      className="!bg-[#000000] !text-white !border-0 hover:!bg-[#242424]"
                      value={0}
                    >
                      any
                    </Option>
                    {selectedSeason &&
                      props.seasons.map((s) => {
                        if (s.season_number === selectedSeason) {
                          let opts = [];
                          for (let i = 1; i < s.episode_count + 1; i++) {
                            opts.push(
                              <Option
                                value={i}
                                key={i}
                                className="!bg-[#000000] !text-white !border-0 hover:!bg-[#242424]"
                              >
                                episode {i}
                              </Option>,
                            );
                          }
                          return opts;
                        }
                      })}
                  </Select>
                </div>
              </>
            )}
            {searchOption === "text" && (
              <>
                <div>
                  <p>Search query</p>
                  <Input
                    value={query}
                    onChange={(t) => setQuery(t.target.value)}
                    className="w-min-28! h-fit mr-2 bg-white/10! bg-pop! text-white! outline-none!"
                  />
                </div>
              </>
            )}
            <div>
              <p>Search Limit</p>
              <Select
                onChange={(_, v) => {
                  if (typeof v !== "number") return;

                  setLimit(v);
                }}
                className=" mr-2 !bg-[#151515] !text-white after:bg-black !w-[150px]"
                sx={{
                  padding: 0,
                  paddingLeft: "10px",
                }}
                name=""
                defaultValue={10}
                placeholder={10}
                id="limit"
              >
                {limitOptions()}
              </Select>
            </div>
            <div
              onMouseOver={(t) => {
                setShowWarning(true);
              }}
              onMouseOut={(t) => {
                setShowWarning(false);
              }}
              className="flex justify-center items-center h-full pt-5 ps-3 cursor-pointer"
              title={``}
            >
              <FontAwesomeIcon
                icon={faExclamationCircle}
                color="yellow"
                className=""
                size="lg"
              />
              {showWarning && (
                <div className="absolute z-50 bg-[#a6a302] p-3 rounded-2xl select-none">
                  <p>
                    Seasons number may be wrong. if you didn't find a season you
                    can switch to{" "}
                    <span
                      onClick={() => {
                        setSearchOption("text");
                        setShowWarning(false);
                      }}
                      className="ps-2 pr-2 pt-1 pb-1 bg-black/80 bg-pop rounded-md hover:bg-black"
                    >
                      text search <FontAwesomeIcon icon={faPen} size="sm" />
                      <br />
                    </span>
                    search example : <br />
                    Get {props.name} season 2 : <br />
                    <span className="ps-2 select-all pr-2 pt-1 pb-1 bg-black/80 bg-pop rounded-md">
                      {props.name} S02
                    </span>
                    <br />
                    Get {props.name} season 3 episode 5 : <br />
                    <span className="ps-2 pr-2 pt-1  select-all pb-1 bg-black/80 bg-pop rounded-md">
                      {props.name} S03E05
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <Btn
            disabled={isLoading}
            onClick={search}
            className="!text-base glass! bg-white/10! !pr-7 !ps-7 !pt-2 !pb-2 !mt-3"
          >
            {isLoading ? <div className="loader"></div> : "Search"}
          </Btn>
        </div>
      </div>
      <div>
        {!isLoading && resp && (
          <>
            <h1 className="text-2xl font-bold mb-5">Torrents Found</h1>
            <div className="lg:p-5 font-bold gap-5 grid md:grid-cols-11 grid-cols-10 lg:grid-cols-12 rounded-md lg:text-base text-sm ">
              <h1 className="col-span-7 text-center">Name</h1>
              <h1 className="col-span-1 text-center sm:block hidden">
                seeders
              </h1>
              <h1 className="col-span-1 text-center sm:block hidden">
                leechers
              </h1>
              <h1 className="col-span-1 text-center sm:hidden block">S</h1>
              <h1 className="col-span-1 text-center sm:hidden block">L</h1>
              <h1 className="col-span-1 text-center md:block hidden">
                Provider
              </h1>
              <h1 className="col-span-1 text-center lg:block hidden">
                torrent page
              </h1>
            </div>
            <FilterTorrents filter={"720p"} torrents={resp} />
            <FilterTorrents filter={"1080p"} torrents={resp} />
            <FilterTorrents filter={"2060p"} torrents={resp} />
            <FilterTorrents filter={"4k"} torrents={resp} />
            <FilterTorrents filter={"h264"} torrents={resp} />
            <FilterTorrents filter={"h265"} torrents={resp} />

            {resp.length === 0 && <h1>No Torrents Found :(</h1>}
          </>
        )}
        {err && !resp && (
          <h1 className="text-red-600">Error when searching for torrents</h1>
        )}
      </div>
    </>
  );
}

export function Torrent({ t }: { t: TorrentSearch }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    getTorrentByInfoHash(t.infoHash).then((torrent) => {
      if (torrent) return setSaved(true);
      setSaved(false);
    });
  }, []);
  return (
    <>
      <div className="lg:p-5 glass items-center lg:text-base text-sm p-2 gap-5 grid md:grid-cols-11 grid-cols-10 lg:grid-cols-12 hover:bg-[#50505059] rounded-md duration-200">
        <a
          href={(() => {
            const url = new URL(
              `/home_cinema/torrents/${t.infoHash}/files`,
              location.origin,
            );
            url.searchParams.set("seeds", `${t.seeders}`);
            url.searchParams.set("leechers", `${t.leechers}`);
            url.searchParams.set("about", `${t.url}`);
            url.searchParams.set("name", `${t.name}`);
            url.searchParams.set("provider", `${t.provider}`);
            return url.href;
          })()}
          className="col-span-7 hover:underline cursor-pointer break-words"
        >
          {t.name}
        </a>
        <p className="col-span-1 text-center">{t.seeders}</p>
        <p className="col-span-1 text-center">{t.leechers}</p>
        <p className="col-span-1 text-center md:block hidden">{t.provider}</p>
        <a
          className="col-span-1 text-center lg:block hidden"
          target="_blank"
          href={t.url}
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
        <SaveButton
          onClick={async () => {
            try {
              if (!saved) {
                await addTorrents(t);
                setSaved(true);
              } else {
                await removeTorrent(t.infoHash);
                setSaved(false);
              }
            } catch (err) {
              console.log(err);
            }
          }}
          saved={saved}
        />
      </div>
    </>
  );
}

function FilterTorrents({
  torrents,
  filter,
}: {
  torrents: TorrentSearch[];
  filter: string;
}) {
  return (
    <>
      {torrents?.find((t) => {
        if (t.name.includes(filter)) return true;
      }) && <p className="font-bold underline">{filter} :</p>}
      {torrents
        ?.sort((a, b) => (b.seeders || 0) - (a.seeders || 0))
        .map((t, i) => {
          if (t.name.toUpperCase().includes(filter.toUpperCase()))
            return <Torrent t={t} key={i}></Torrent>;
        })}
    </>
  );
}

function limitOptions() {
  let elements = [];
  for (let i = 0; i < 7; i++) {
    elements.push(
      <Option
        className="!bg-[#000000] !text-white !border-0 hover:!bg-[#242424]"
        value={(i + 1) * 10}
      >
        {(i + 1) * 10}
      </Option>,
    );
  }
  return elements;
}
