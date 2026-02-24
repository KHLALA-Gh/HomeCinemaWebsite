import { useNavigate, useParams } from "react-router";
import { useGetYTSMovieDetails } from "../../hooks/getMoviesDetails";
import Button from "../../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { SaveButton } from "../../components/Movie/Movie";
import { addMovie, getMovieById, removeMovie } from "../../lib/idb";
import NavBar from "../../components/Navbar";

export default function MoviePage() {
  const params = useParams();
  const { resp, isLoading } = useGetYTSMovieDetails(params.id as string);
  return <MovieDetails resp={resp} isLoading={isLoading} />;
}

export function MovieDetails({
  resp,
  isLoading,
}: {
  resp?: MovieDetails;
  isLoading: boolean;
}) {
  const [showQ, setShowQ] = useState(false);
  const link = (index: number) => {
    const url = new URL(
      `/home_cinema/torrents/${resp?.torrents[index].hash}/files`,
      location.origin,
    );
    url.searchParams.set("seeds", `${resp?.torrents[index].seeds}`);
    url.searchParams.set("about", `${resp?.torrents[index].url}`);
    url.searchParams.set(
      "name",
      `${resp?.title} (${resp?.year}) [${resp?.torrents[index].quality}] [YTS]`,
    );
    url.searchParams.set("provider", `YTS`);
    return url.href;
  };
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    if (resp?.id) {
      getMovieById(resp.id).then((mov) => {
        if (mov) {
          setSaved(true);
        }
      });
    }
  }, [resp]);
  const nav = useNavigate();
  return (
    <>
      <NavBar />
      <div className="xl:ps-28 xl:pr-28 md:ps-8 md:pr-8 sm:ps-0 sm:pr-0 ps-3 pr-3 md:mt-20 mt-10">
        <div
          className="md:mb-10 mb-10 cursor-pointer bg-white rounded-full h-10 w-10 flex justify-center items-center"
          onClick={() => {
            nav(-1);
          }}
        >
          <FontAwesomeIcon
            className="h-5! font-bold text-black"
            icon={faChevronLeft}
          />
        </div>

        <div className="flex items-center md:items-start flex-col-reverse md:flex-row md:gap-10 flex-wrap md:justify-start justify-center md:flex-nowrap">
          <div className={"blur-[100px] absolute z-0"}>
            <img src={resp?.medium_cover_image} alt="" />
          </div>
          <div
            className={
              "z-20  h-[345px] w-[230px] rounded-lg md:relative absolute top-[30%]" +
              (isLoading ? " loading-background relative" : "")
            }
            style={
              !isLoading
                ? {
                    backgroundImage: `url(${resp?.medium_cover_image})`,
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
                  {resp?.title} {resp?.year ? `(${resp.year})` : ""}
                </h1>
                <SaveButton
                  onClick={async () => {
                    if (!saved && resp) {
                      await addMovie({
                        id: resp?.id,
                        title: resp?.title,
                        year: resp.year,
                        rating: resp.rating,
                        medium_cover_image: resp.medium_cover_image,
                        runtime: resp.runtime?.toString(),
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
                {resp?.description_intro}
              </p>

              <p
                className={
                  "" + (isLoading ? " loading-background w-50 h-5" : "")
                }
              >
                {isLoading ? "" : "Genres :"} {resp?.genres?.join(" / ")}
              </p>
              <div
                className={
                  "flex gap-5 flex-wrap " +
                  (isLoading ? " loading-background w-60 h-5" : "")
                }
              >
                <p>Available in : </p>
                {resp?.torrents.map((t, i) => {
                  return (
                    <div
                      key={i}
                      className="lg:text-base text-sm h-fit border-[1px] border-white ps-2 pr-2 cursor-pointer"
                      onClick={() => {
                        if (t.quality === "2160p") {
                          location.href = link(i);
                        }
                        location.href = link(i);
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
              <p>Rating : {resp?.rating}</p>
              <p>
                Duration : {Math.floor((resp?.runtime as number) / 60)}h{" "}
                {(resp?.runtime as number) -
                  Math.floor((resp?.runtime as number) / 60) * 60}
                min
              </p>
              <div className="flex gap-5">
                <Button
                  className="md:text-xl text-lg"
                  onClick={() => {
                    setShowQ(!showQ);
                  }}
                >
                  Watch
                </Button>
                <a
                  target="_blank"
                  href={
                    "https://www.youtube.com/watch?v=" + resp?.yt_trailer_code
                  }
                >
                  <Button className="md:text-xl text-lg">Trailer</Button>
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
          <div
            onClick={() => setShowQ(false)}
            className="w-full h-full bg-[#0000002a] absolute z-1000 top-0 left-0"
          ></div>
          <div className="h-[80vh] hide-scrollbar h-fit inset-shadow-sm/40 text-white shadow-2xl border border-white/10 inset-shadow-white/40 bg-black/40 backdrop-blur-xs  xl:w-auto w-[90%] overflow-y-scroll fixed p-3 md:p-5 bg-[#0f0f0f] top-[50%] z-1001 left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md border-2 border-white">
            <div
              className="ms-3 mb-3 mt-3 flex justify-end cursor-pointer"
              onClick={() => {
                setShowQ(false);
              }}
            >
              <FontAwesomeIcon size="lg" icon={faXmark} />
            </div>
            {resp?.torrents.map((t, i) => {
              return (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center mb-5 gap-3 hover:bg-[#b4b4b43e] p-3 duration-100 rounded-md cursor-pointer"
                >
                  <div
                    className="col-span-9"
                    onClick={() => {
                      location.href = link(i);
                    }}
                  >
                    <h1 className="text-2xl col-span-6">{t.quality}</h1>
                    <h3 className="col-span-3">
                      {t.type}
                      {""}
                      {t.video_codec === "x265" ? (
                        <span className="text-green-600">.{t.video_codec}</span>
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
          </div>
        </>
      )}
    </>
  );
}
