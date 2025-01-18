import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Movie from "../Movie/Movie";

interface MoviesListResponseData {
  isLoading?: boolean;
  err?: string;
  resp?: MovieMetaData[];
  category: string;
  listID: string;
}

export function returnLoadingMovies() {
  let arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(<Movie key={i} loading={true} />);
  }
  return arr;
}

export function MoviesListCategory({
  isLoading,
  err,
  resp,
  category,
  listID,
}: MoviesListResponseData) {
  return (
    <>
      <div className="md:ps-28 md:pe-28 ps-10 pr-10">
        <h1 className="font-extrabold text-xl md:text-4xl mb-10 md:mb-20 mt-7 md:mt-20">
          {category}
        </h1>
        {isLoading && !err && <List listID="">{returnLoadingMovies()}</List>}
        {!isLoading && !err && resp && (
          <List listID={listID}>
            <>
              {resp.map((m, i) => {
                return <Movie key={i} m={m} />;
              })}
            </>
          </List>
        )}
      </div>
    </>
  );
}

export default function List({
  children,
  listID,
}: {
  children: React.ReactNode;
  listID: string;
}) {
  return (
    <>
      <div className="relative overflow-visible md:ps-10">
        <div
          onClick={() => {
            let list = document.getElementById(listID);
            list?.scroll({ left: list.scrollLeft - 300 });
          }}
          className="absolute hidden md:block w-fit left-[-40px] cursor-pointer  top-[50%] translate-y-[-50%] bg-[#444] p-5 z-10 rounded-md"
        >
          <FontAwesomeIcon icon={faLeftLong} className="text-white" />
        </div>
        <div
          onClick={() => {
            let list = document.getElementById(listID);
            list?.scroll({ left: list.scrollLeft + 300 });
          }}
          className="absolute hidden md:block w-fit right-[-40px] cursor-pointer  top-[50%] translate-y-[-50%] bg-[#444] p-5 z-10 rounded-md"
        >
          <FontAwesomeIcon icon={faRightLong} className="text-white" />
        </div>
        <div
          id={listID}
          className="flex gap-8 lg:gap-16 overflow-x-scroll whitespace-nowrap horz-list relative"
        >
          {children}
        </div>
      </div>
    </>
  );
}
