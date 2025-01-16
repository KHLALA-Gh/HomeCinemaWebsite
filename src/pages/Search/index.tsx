import { useSearchParams } from "react-router";
import { useGetYTSList } from "../../hooks/getYTSList";
import NavBar from "../../components/Navbar";
import { returnLoadingMovies } from "../../components/List";
import { useEffect, useState } from "react";
import Movie from "../../components/Movie/Movie";

export default function Search() {
  const [searchP] = useSearchParams();
  const [term] = useState("");
  const { resp, err, isLoading, fetch } = useGetYTSList({
    queries: [["query_term", term]],
    fetchWhenCall: false,
  });
  useEffect(() => {
    let t = searchP.get("term");
    if (!t) t = "";
    fetch([
      ["query_term", t],
      ["sort_by", "like_count"],
    ]);
  }, [searchP]);
  return (
    <>
      <NavBar />
      <div className="md:ps-28 md:pe-28 ps-3 pr-3 mt-10 md:mt-20 mb-20">
        <h1 className="md:text-4xl text-xl mb-10 md:mb-20 font-extrabold">
          Search results
        </h1>
        {err && <h1 className="text-red-500">Error when searching : {err}</h1>}
        {isLoading && !err && (
          <>
            <div className="flex gap-5 justify-center">
              {" "}
              {returnLoadingMovies()}{" "}
            </div>
          </>
        )}
        {!isLoading && !err && (
          <>
            <div className="flex gap-4 md:gap-16 flex-wrap justify-center">
              {resp?.map((m, i) => {
                return <Movie key={i} m={m} />;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
