import { useGetYTSList } from "../../hooks/getYTSList";
import Movie from "../../components/Movie/Movie";
import NavBar from "../../components/Navbar";
import "./style.css";
import { MoviesListCategory } from "../../components/List";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

export default function Watch() {
  const { resp, err, isLoading } = useGetYTSList({
    queries: [["sort_by", "like_count"]],
  });
  const {
    resp: respNew,
    err: errNew,
    isLoading: isLoadingNew,
  } = useGetYTSList({ queries: [["sort_by", "date_added"]] });
  const {
    resp: respAction,
    err: errAction,
    isLoading: isLoadingAction,
  } = useGetYTSList({
    queries: [
      ["genre", "Action"],
      ["sort_by", "rating"],
    ],
  });
  const {
    resp: respAny,
    err: errAny,
    isLoading: isLoadingAny,
  } = useGetYTSList({ queries: [["sort_by", "download_count"]] });
  return (
    <>
      <NavBar mode="Movies" />
      {err && (
        <div className="bg-[#ff38384f] rounded-md border-2 border-red-600 p-4 flex items-center gap-3">
          <FontAwesomeIcon icon={faXmarkCircle} />
          <h1> {err} </h1>
        </div>
      )}
      <MoviesListCategory
        resp={resp}
        err={err}
        isLoading={isLoading}
        listID="best"
        category="Best Movies"
      />
      <MoviesListCategory
        resp={respNew}
        err={errNew}
        isLoading={isLoadingNew}
        listID="new"
        category="New Movies"
      />
      <MoviesListCategory
        resp={respAction}
        err={errAction}
        isLoading={isLoadingAction}
        listID="action"
        category="Action"
      />
      <div className="md:ps-28 md:pe-28 ps-2">
        <h1 className="font-extrabold text-xl md:text-4xl mb-10 md:mb-20 mt-7 md:mt-20">
          Movies you may like
        </h1>
        <div className="flex flex-wrap justify-center gap-7 md:gap-16 lg:mt-20 ">
          {!isLoadingAny && !errAny && (
            <>
              {respAny?.map((m, i) => {
                return <Movie key={i} m={m} />;
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
