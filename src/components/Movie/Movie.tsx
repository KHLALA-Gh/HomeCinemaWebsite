import { faStar, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Movie({
  m,
  loading,
}: {
  m?: MovieMetaData;
  loading?: boolean;
}) {
  return (
    <>
      {!loading && m && (
        <div
          onClick={() => {
            location.href = "/home_cinema/watch/" + m.id;
          }}
          className="lg:w-[230px] w-[115px] h-[172px] relative lg:h-[345px] shrink-0 cursor-pointer"
          style={{
            backgroundImage: `url("${m.medium_cover_image}")`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full opacity-0 hover:opacity-100 relative pt-10 bg-[#0000009c] duration-300">
            <h1 className="text-center text-sm lg:text-lg  font-bold lg:overflow-auto overflow-hidden text-nowrap lg:text-wrap">
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
      )}
      {loading && (
        <div className="lg:w-[230px] w-[115px] h-[172px] relative lg:h-[345px] shrink-0 loading-background"></div>
      )}
    </>
  );
}
