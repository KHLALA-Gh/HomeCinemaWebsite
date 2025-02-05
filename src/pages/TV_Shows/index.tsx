import { SetURLSearchParams, useSearchParams } from "react-router";
import { useGetTVShows } from "../../hooks/getTVShows";
import Show from "../../components/Show";
import NavBar from "../../components/Navbar";
import { useEffect } from "react";
import { returnLoadingMovies } from "../../components/List";
import { useSearchTVShows } from "../../hooks/useSearchTVShows";

function Page({
  page,
  focus,
  setSearchParams,
  query,
}: {
  setSearchParams: SetURLSearchParams;
  page: string;
  focus?: boolean;
  query?: string;
}) {
  return (
    <div
      onClick={() => {
        setSearchParams([
          ["page", page],
          ["query", query || ""],
        ]);
      }}
      className={
        "rounded-full text-black w-7 h-7 flex items-center justify-center cursor-pointer " +
        (focus ? "bg-white" : "")
      }
    >
      <h1
        className={
          "text-center font-bold " + (focus ? "text-black" : "text-white")
        }
      >
        {page}
      </h1>
    </div>
  );
}

function Pages({
  page,
  setSearchParams,
  pageCount,
  query,
}: {
  setSearchParams: SetURLSearchParams;
  page: string;
  pageCount?: number;
  query?: string;
}) {
  return (
    <div className="flex justify-center gap-1 mt-3">
      <button
        className="mr-3"
        onClick={() => {
          if (+page - 1 < 1) return;
          setSearchParams([
            ["page", `${+page - 1}`],
            ["query", query || ""],
          ]);
        }}
      >
        Previous
      </button>
      {+page - 60 > 0 && (
        <>
          <Page
            query={query}
            setSearchParams={setSearchParams}
            page={`${+page - 60}`}
          />
          <h1>...</h1>
        </>
      )}
      {+page - 2 > 0 && (
        <Page
          query={query}
          setSearchParams={setSearchParams}
          page={`${+page - 2}`}
        />
      )}
      {+page - 1 > 0 && (
        <Page
          query={query}
          setSearchParams={setSearchParams}
          page={`${+page - 1}`}
        />
      )}
      <Page
        query={query}
        setSearchParams={setSearchParams}
        page={page as string}
        focus={true}
      />
      {+page + 1 <= (pageCount || 500) && (
        <>
          <Page
            query={query}
            setSearchParams={setSearchParams}
            page={`${+page + 1}`}
          />
        </>
      )}
      {+page + 2 <= (pageCount || 500) && (
        <>
          <Page
            query={query}
            setSearchParams={setSearchParams}
            page={`${+page + 2}`}
          />
        </>
      )}

      {+page + 60 <= (pageCount || 500) && (
        <>
          <h1>...</h1>
          <Page
            query={query}
            setSearchParams={setSearchParams}
            page={`${+page + 60}`}
          />
        </>
      )}
      <button
        className="ms-3"
        onClick={() => {
          if (+page + 1 > (pageCount || 500)) return;
          setSearchParams([
            ["page", `${+page + 1}`],
            ["query", query || ""],
          ]);
        }}
      >
        Next
      </button>
    </div>
  );
}

export default function TVShows() {
  const [sp, setSearchParams] = useSearchParams();
  const { resp, isLoading, err, fetch } = useGetTVShows({
    page: sp.get("page") as string,
  });
  const {
    resp: respQuery,
    isLoading: isLoadingQuery,
    err: errQuery,
    fetch: fetchQuery,
  } = useSearchTVShows();
  useEffect(() => {
    if (!sp.get("page")) {
      //setSearchParams({ page: "1" });
    }
  }, [sp]);
  useEffect(() => {
    let q = sp.get("query");
    if (q) {
      console.log(q);

      let p = sp.get("page");
      fetchQuery(q, p || "1");
    } else {
      fetch();
    }
  }, [sp]);
  return (
    <>
      <NavBar mode="TV" />
      <div className="md:ps-28 md:pe-28 ps-5 pr-5">
        <h1 className="md:text-3xl text-xl font-extrabold mt-10 mb-10">
          TV Shows
        </h1>
        <div className="flex justify-center gap-10 flex-wrap">
          {!respQuery &&
            resp?.results.map((show, i) => {
              return <Show {...show} key={i} />;
            })}
          {respQuery &&
            respQuery?.results.map((show, i) => {
              return <Show {...show} key={i} />;
            })}
        </div>
        <div className="mt-5 mb-5">
          <Pages
            setSearchParams={setSearchParams}
            page={sp.get("page") || ("1" as string)}
            pageCount={resp ? resp.total_pages : respQuery?.total_pages}
            query={sp.get("query") || ""}
          />
        </div>
        {(isLoading || isLoadingQuery) && !err && (
          <div className="flex justify-center gap-10 flex-wrap">
            {returnLoadingMovies()}
          </div>
        )}
        {err && (
          <div className="w-full h-screen">
            <div className="bg-red-600 p-5 border-2 border-red-700">
              <h1>{err}</h1>
            </div>
          </div>
        )}
        {errQuery && (
          <div className="w-full h-screen">
            <div className="bg-red-600 p-5 border-2 border-red-700">
              <h1>error when searching : {err}</h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
