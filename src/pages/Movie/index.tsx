import { useParams } from "react-router";
import { useGetYTSMovieDetails } from "../../hooks/getMoviesDetails";
import Button from "../../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faFile,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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
  const link = (hash: string) => {
    return `/home_cinema/torrents/${hash}/files?about=${resp?.url}`;
  };
  return (
    <>
      <div className="lg:ps-28 lg:pr-28 ps-8 pr-8 md:mt-20 mt-10">
        <div
          className="md:mb-20 mb-10 cursor-pointer"
          onClick={() => {
            location.href = "/home_cinema/watch";
          }}
        >
          <FontAwesomeIcon className="h-8" icon={faChevronLeft} />
        </div>
        <div className="flex items-center md:items-start flex-col-reverse md:flex-row md:gap-16 flex-wrap md:justify-start justify-center md:flex-nowrap">
          <div className={"blur-[100px] absolute z-0"}>
            <img src={resp?.medium_cover_image} alt="" />
          </div>
          <div
            className={
              "z-20  h-[345px] w-[230px] rounded-lg md:relative absolute top-[30%]" +
              (isLoading ? " loading-background relative" : "")
            }
            style={{
              backgroundImage: `url(${resp?.medium_cover_image})`,
              backgroundSize: "cover",
            }}
          >
            <div className="rounded-lg bg-gradient-to-t from-[#000000] to-[#00000091] w-full h-full z-30 block md:hidden"></div>
          </div>
          <div className="lg:text-lg flex flex-col gap-3 z-20">
            <h1
              className={
                "text-3xl font-extrabold" +
                (isLoading ? " loading-background w-20" : "")
              }
            >
              {resp?.title} {resp?.year ? `(${resp.year})` : ""}
            </h1>
            <p className={"" + (isLoading ? " loading-background w-10" : "")}>
              Genres : {resp?.genres.join(" / ")}
            </p>
            <div className="flex gap-5 flex-wrap">
              <p>Available in : </p>
              {resp?.torrents.map((t, i) => {
                return (
                  <div
                    key={i}
                    className="lg:text-base text-sm h-fit border-[1px] border-white ps-2 pr-2 cursor-pointer"
                    onClick={() => {
                      if (t.quality === "2160p") {
                        location.href = link(t.hash);
                      }
                      location.href = link(t.hash);
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
                        <span className="text-green-600">.{t.video_codec}</span>
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
              <Button
                onClick={() => {
                  location.href =
                    "https://www.youtube.com/watch?v=" + resp?.yt_trailer_code;
                }}
                className="md:text-xl text-lg"
              >
                Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showQ && (
        <>
          <div
            onClick={() => setShowQ(false)}
            className="w-full h-full bg-[#000000c0] absolute z-40 top-0 left-0"
          ></div>
          <div className="h-[80vh] xl:w-auto w-[90%] overflow-y-scroll fixed p-3 md:p-10 bg-[#0f0f0f] top-[50%] z-50 left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md border-2 border-white">
            <div
              className="ms-3 mb-5 mt-5 cursor-pointer"
              onClick={() => {
                setShowQ(false);
              }}
            >
              <FontAwesomeIcon icon={faX} />
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
                      location.href = link(t.hash);
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
