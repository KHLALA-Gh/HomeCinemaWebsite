import { useNavigate, useParams } from "react-router";
import { useGetYTSMovieDetails } from "../../hooks/getMoviesDetails";
import Button from "../../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { SaveButton } from "../../components/Movie/Movie";
import { addMovie, getMovieById, removeMovie } from "../../lib/idb";
import { FloatingDiv } from "../../components/Utils/floating-div";
import { Back } from "../../components/Utils/back";
import { useTMDBMovieDetails } from "../../hooks/useTMDBMovieDetails";
import { useTorrentioMovies } from "../../hooks/useTorrentioMovies";
import { Torrent } from "../../components/Show_Details";

export default function MoviePage() {
  const params = useParams();
  const { resp, isLoading } = useTMDBMovieDetails(params.id as string);

  return <MovieDetails resp={resp} isLoading={isLoading} />;
}

export function MovieDetails({
  resp,
  isLoading,
}: {
  resp?: TMDBMovieDetails;
  isLoading: boolean;
}) {
  const {
    resp: ytsMovie,
    isLoading: ytsLoading,
    fetch,
  } = useGetYTSMovieDetails(resp?.imdb_id as string);
  const {
    resp: torrentioTorrents,
    isLoading: torrentioLoading,
    err: torrentioErr,
    fetch: torrentioFetch,
  } = useTorrentioMovies();
  const [showQ, setShowQ] = useState(false);
  const link = (index: number) => {
    if (!ytsMovie?.torrents) return;
    const url = new URL(
      `/home_cinema/torrents/${ytsMovie?.torrents[index].hash}/files`,
      location.origin,
    );
    url.searchParams.set("seeds", `${ytsMovie?.torrents[index].seeds}`);
    url.searchParams.set("about", `${ytsMovie?.torrents[index].url}`);
    url.searchParams.set(
      "name",
      `${resp?.title} (${resp?.release_date}) [${ytsMovie?.torrents[index].quality}] [YTS]`,
    );
    url.searchParams.set("provider", `YTS`);
    return url.href;
  };
  const [saved, setSaved] = useState<boolean>(false);
  const [source, setSource] = useState<"yts" | "torrentio">("yts");
  useEffect(() => {
    if (resp?.id) {
      getMovieById(resp.id).then((mov) => {
        if (mov) {
          setSaved(true);
        }
      });
    }
    if (resp?.imdb_id) {
      fetch();
      torrentioFetch(resp.imdb_id);
    }
  }, [resp]);
  const filterTorrents = (torrents?: TorrentioResp) => {
    if (!torrents) return;
    const q720 = torrents?.streams.filter((t) => t.name.includes("720p"));
    const q1080 = torrents?.streams.filter((t) => t.name.includes("1080p"));
    const q4k = torrents?.streams.filter((t) => t.name.includes("4k"));
    const others = torrents?.streams.filter(
      (t) =>
        !t.name.includes("4k") &&
        !t.name.includes("1080p") &&
        !t.name.includes("720p"),
    );

    return (
      <div>
        {torrentioLoading && <h1>Loading...</h1>}
        {q720?.length > 0 && (
          <>
            <h1 className="font-bold text-lg mb-2">720p</h1>
            {q720?.map((t, i) => {
              return (
                <Torrent
                  key={i}
                  t={{
                    name: t.title,
                    infoHash: t.infoHash,
                  }}
                />
              );
            })}
          </>
        )}
        {q1080.length > 0 && (
          <>
            <h1 className="font-bold text-lg mb-2">1080p</h1>
            {q1080?.map((t, i) => {
              return (
                <Torrent
                  key={i}
                  t={{
                    name: t.title,
                    infoHash: t.infoHash,
                  }}
                />
              );
            })}
          </>
        )}
        {q4k.length > 0 && (
          <>
            <h1 className="font-bold text-lg mb-2">4K</h1>
            {q4k?.map((t, i) => {
              return (
                <Torrent
                  key={i}
                  t={{
                    name: t.title,
                    infoHash: t.infoHash,
                  }}
                />
              );
            })}
          </>
        )}
        {others.length > 0 && (
          <>
            <h1 className="font-bold text-lg mb-2">Others</h1>
            {others?.map((t, i) => {
              return (
                <Torrent
                  key={i}
                  t={{
                    name: t.title,
                    infoHash: t.infoHash,
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    );
  };
  const nav = useNavigate();
  return (
    <>
      <div className="xl:ps-28 xl:pr-28 md:ps-8 md:pr-8 sm:ps-0 sm:pr-0 ps-3 pr-3 md:mt-20 mt-10">
        <div className="mb-6">
          <Back />
        </div>

        <div className="flex items-center md:items-start flex-col-reverse md:flex-row md:gap-10 flex-wrap md:justify-start justify-center md:flex-nowrap">
          <div className={"blur-[85px] left-50 absolute z-0 opacity_anim"}>
            <img
              src={"https://image.tmdb.org/t/p/original" + resp?.poster_path}
              alt=""
              className="w-[400px] h-[400px] rounded-full"
            />
          </div>
          <div
            className={
              "z-20  h-[345px] w-[230px] rounded-lg md:relative absolute top-[30%]" +
              (isLoading ? " loading-background relative" : "")
            }
            style={
              !isLoading
                ? {
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${resp?.poster_path})`,
                    backgroundSize: "cover",
                  }
                : {}
            }
          >
            <div className="rounded-lg bg-gradient-to-t from-[#000000] to-[#00000091] w-full h-full z-30 block md:hidden"></div>
          </div>
          {!isLoading && (
            <div className="lg:text-lg flex flex-col gap-3 z-20">
              <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <h1
                  className={
                    "text-3xl font-extrabold" +
                    (isLoading ? " loading-background w-80 h-5" : "")
                  }
                >
                  {resp?.title}{" "}
                  {resp?.release_date ? `(${resp.release_date})` : ""}
                </h1>
                <SaveButton
                  onClick={async () => {
                    if (!saved && resp) {
                      await addMovie({
                        id: resp?.id,
                        title: resp?.title,
                        rating: resp.vote_average,
                        medium_cover_image: resp.poster_path,
                        year: resp.release_date,
                        runtime: "",
                      });
                      setSaved(true);
                    } else {
                      if (!resp) return;
                      await removeMovie(resp?.id);
                      setSaved(false);
                    }
                  }}
                  saved={saved}
                />
              </div>
              <p className="xl:max-w-[1000px] lg:max-w-[700px] max-w-[500px] xl:text-[16px] text-sm">
                {resp?.overview}
              </p>

              <p
                className={
                  "" + (isLoading ? " loading-background w-50 h-5" : "")
                }
              >
                {isLoading ? "" : "Genres :"}{" "}
                {resp?.genres?.map((g) => g.name).join(" / ")}
              </p>
              <div
                className={
                  "flex gap-3 flex-wrap items-center " +
                  (isLoading ? " loading-background w-60 h-5" : "")
                }
              >
                <p>Available in : </p>
                {ytsMovie?.torrents?.map((t, i) => {
                  return (
                    <div
                      key={i}
                      className="lg:text-base text-sm h-fit bg-pop rounded-full bg-white/10 ps-2 pr-2 cursor-pointer"
                      onClick={() => {
                        let url = link(i);
                        if (!url) return;
                        if (t.quality === "2160p") {
                          location.href = url;
                        }
                        location.href = url;
                      }}
                    >
                      <p
                        className={
                          "" + (t.quality === "2160p" ? "text-yellow-500" : "")
                        }
                      >
                        {t.quality}
                        {""}
                        {t.video_codec === "x265" ? (
                          <span className="text-green-600">
                            .{t.video_codec}
                          </span>
                        ) : (
                          ""
                        )}
                        {t.type != "bluray" ? "." + t.type : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p>Rating : {resp?.vote_average}</p>
              <p>
                Duration : {Math.floor((resp?.runtime as number) / 60)}h{" "}
                {(resp?.runtime as number) -
                  Math.floor((resp?.runtime as number) / 60) * 60}
                min
              </p>
              <div className="flex gap-3">
                <Button
                  className="md:text-xl text-[0px]! hover:text-lg! hover:ps-4! hover:pr-4! p-2! ps-5! duration-200 flex gap-3 items-center text-lg bg-pop! bg-white/10! inset-shadow-2xs!"
                  onClick={() => {
                    setShowQ(!showQ);
                  }}
                >
                  <FontAwesomeIcon className="text-base!" icon={faPlay} />
                  <p>Watch</p>
                </Button>
                <a
                  target="_blank"
                  href={
                    "https://www.youtube.com/watch?v=" +
                    ytsMovie?.yt_trailer_code
                  }
                >
                  <Button className="md:text-lg text-base ps-6! pr-6! bg-white/10!">
                    Trailer
                  </Button>
                </a>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-5">
              <div className=" loading-background w-80 h-5 "></div>
              <div className=" loading-background w-60 h-5 "></div>
              <div className=" loading-background w-70 h-5 "></div>
              <div className=" loading-background w-30 h-5 "></div>
              <div className=" loading-background w-60 h-10 mt-15"></div>
            </div>
          )}
        </div>
      </div>
      {showQ && (
        <>
          <FloatingDiv
            blur
            onClose={() => setShowQ(false)}
            title="Choose source"
          >
            <div className="h-[70vh] max-h-[70vh] overflow-y-scroll mt-3 h-fit text-white xl:w-auto overflow-y-scroll z-1001">
              <div className="flex gap-3 mb-2">
                {ytsMovie?.torrents?.length && (
                  <h1
                    onClick={() => setSource("yts")}
                    className={
                      "hover:bg-[#292929] rounded-lg p-2 cursor-pointer" +
                      (source === "yts" ? " bg-[#2a2a2a]" : "")
                    }
                  >
                    YTS
                  </h1>
                )}
                {torrentioLoading && (
                  <h1 className="p-2">Torrentio loading...</h1>
                )}
                {/*@ts-ignore */}
                {torrentioTorrents?.streams.length > 0 && (
                  <h1
                    onClick={() => setSource("torrentio")}
                    className={
                      "hover:bg-[#292929] rounded-lg p-2 cursor-pointer" +
                      (source === "torrentio" ? " bg-[#2a2a2a]" : "")
                    }
                  >
                    Torrentio
                  </h1>
                )}
                {!torrentioTorrents?.streams.length &&
                  !ytsMovie?.torrents?.length &&
                  !torrentioLoading && <h1>No torrent source available :(</h1>}
              </div>
              {ytsMovie?.torrents?.length !== 0 &&
                source === "yts" &&
                ytsMovie?.torrents?.map((t, i) => {
                  return (
                    <div
                      key={i}
                      className="grid pop grid-cols-12 items-center mb-5 gap-3 hover:bg-[#b4b4b43e] p-3 duration-100 rounded-2xl cursor-pointer"
                    >
                      <div
                        className="col-span-9"
                        onClick={() => {
                          let url = link(i);
                          if (!url) return;
                          location.href = url;
                        }}
                      >
                        <h1 className="text-2xl col-span-6">{t.quality}</h1>
                        <h3 className="col-span-3">
                          {t.type}
                          {""}
                          {t.video_codec === "x265" ? (
                            <span className="text-green-600">
                              .{t.video_codec}
                            </span>
                          ) : (
                            ""
                          )}
                        </h3>
                      </div>
                      <div className="flex gap-3 items-center justify-center col-span-3 bg-[#202020] p-2 rounded-md">
                        <h6 className="col-span-1 text-sm">{t.size}</h6>
                      </div>
                    </div>
                  );
                })}
              {(!ytsMovie?.torrents ||
                ytsMovie.torrents?.length === 0 ||
                source === "torrentio") &&
                (torrentioLoading ? (
                  <>
                    <div>
                      <h1>Loading...</h1>
                    </div>
                  </>
                ) : (
                  filterTorrents(torrentioTorrents)
                ))}
            </div>
          </FloatingDiv>
        </>
      )}
    </>
  );
}
