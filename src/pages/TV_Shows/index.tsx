import { SetURLSearchParams, useSearchParams } from "react-router";
import { useGetTVShows } from "../../hooks/getTVShows";
import Show from "../../components/Show";
import NavBar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { returnLoadingMovies } from "../../components/List";

function Page({
  page,
  focus,
  setSearchParams,
}: {
  setSearchParams: SetURLSearchParams;
  page: string;
  focus?: boolean;
}) {
  return (
    <div
      onClick={() => {
        setSearchParams({ page });
        location.reload();
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
}: {
  setSearchParams: SetURLSearchParams;
  page: string;
}) {
  return (
    <div className="flex justify-center gap-1 mt-3">
      <button
        className="mr-3"
        onClick={() => {
          if (+page - 1 < 1) return;
          setSearchParams({ page: `${+page - 1}` });
          location.reload();
        }}
      >
        Previous
      </button>
      {+page - 60 > 0 && (
        <>
          <Page setSearchParams={setSearchParams} page={`${+page - 60}`} />
          <h1>...</h1>
        </>
      )}
      {+page - 2 > 0 && (
        <Page setSearchParams={setSearchParams} page={`${+page - 2}`} />
      )}
      {+page - 1 > 0 && (
        <Page setSearchParams={setSearchParams} page={`${+page - 1}`} />
      )}
      <Page
        setSearchParams={setSearchParams}
        page={page as string}
        focus={true}
      />
      {+page + 1 <= 500 && (
        <>
          <Page setSearchParams={setSearchParams} page={`${+page + 1}`} />
        </>
      )}
      {+page + 2 <= 500 && (
        <>
          <Page setSearchParams={setSearchParams} page={`${+page + 2}`} />
        </>
      )}

      {+page + 60 <= 500 && (
        <>
          <h1>...</h1>
          <Page setSearchParams={setSearchParams} page={`${+page + 60}`} />
        </>
      )}
      <button
        className="ms-3"
        onClick={() => {
          if (+page + 1 > 500) return;
          setSearchParams({ page: `${+page + 1}` });
          location.reload();
        }}
      >
        Next
      </button>
    </div>
  );
}

export default function TVShows() {
  const [sp, setSearchParams] = useSearchParams();
  const { resp, isLoading, err } = useGetTVShows({
    page: sp.get("page") as string,
  });
  useEffect(() => {
    if (!sp.get("page")) {
      setSearchParams({ page: "1" });
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className="md:ps-28 md:pe-28 ps-5 pr-5">
        <h1 className="md:text-3xl text-xl font-extrabold mt-10 mb-10">
          TV Shows
        </h1>
        {!isLoading && !err && (
          <>
            <div className="flex justify-center gap-10 flex-wrap">
              {resp?.results.map((show, i) => {
                return <Show {...show} key={i} />;
              })}
            </div>
            <div className="mt-5 mb-5">
              <Pages
                setSearchParams={setSearchParams}
                page={sp.get("page") as string}
              />
            </div>
          </>
        )}
        {isLoading && !err && (
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
      </div>
    </>
  );
}
