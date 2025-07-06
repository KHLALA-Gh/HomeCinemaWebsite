import { faFilm, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input/Input";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DrawerMobileNavigation from "./drawer";

interface NavbarProps {
  mode?: "Movies" | "TV";
}

export default function NavBar(props: NavbarProps) {
  const [openS, setOpenS] = useState(false);
  const [changeW, setChangeW] = useState(false);
  const [searchP] = useSearchParams();
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (openS === true) {
      setTimeout(() => {
        setChangeW(true);
      }, 15);
      return;
    }
    setChangeW(false);
  }, [openS]);
  useEffect(() => {
    let t = searchP.get("term");
    if (t) {
      setTerm(t);
    }
  }, [searchP]);
  const onPressEnter = (id: string, key: string) => {
    if (key === "Enter") {
      // @ts-ignore
      let term = document?.getElementById(id).value;
      if (props.mode === "TV") {
        navigate(`/home_cinema/watch_tv_shows?query=${term}`);
      } else {
        location.href = `/home_cinema/search?term=${term}`;
      }
    }
  };
  return (
    <>
      <div className="w-full mt-10">
        <div
          className={
            "flex justify-between ps-8 pr-8 sm:ps-32 sm:pr-32 " +
            (openS ? "!justify-center" : "")
          }
        >
          {!openS && (
            <a
              href={
                props.mode === "Movies" || !props.mode
                  ? "/home_cinema/"
                  : "/home_cinema/watch_tv_shows"
              }
            >
              <div>
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faFilm} className="lg:h-10 h-7 mt-1" />
                  <h1 className="lg:text-4xl lg:text-xl font-black">
                    Home Cinema
                    {props.mode === "TV" && (
                      <p className="text-sm font-normal p-0">TV Shows</p>
                    )}
                  </h1>
                  {props.mode === "TV" && (
                    <p className="border-2 border-green-600 pr-5 ps-5 font-semibold text-green-600 rounded-full">
                      Beta
                    </p>
                  )}
                </div>
              </div>
            </a>
          )}
          <div className="flex justify-center xl:gap-20 gap-6 items-center text-base">
            <a
              href={
                props.mode === "Movies" || !props.mode
                  ? "/home_cinema/watch_tv_shows"
                  : "/home_cinema/watch"
              }
              className="font-bold lg:block hidden"
            >
              {props.mode === "TV" && <>Movies</>}
              {(props.mode === "Movies" || !props.mode) && <>TV Shows</>}
            </a>
            <a
              href="/home_cinema/streams"
              className="font-bold lg:block hidden"
            >
              Streams
            </a>
            <a
              href="/home_cinema/torrents"
              className="font-bold lg:block hidden"
            >
              Torrents
            </a>
            <div className="md:block hidden">
              <Input
                value={term}
                id="searchInp1"
                className="!w-[150px]"
                onKeyUp={(p) => onPressEnter("searchInp1", p.key)}
                onChange={(e) => {
                  // @ts-ignore
                  setTerm(e.value);
                }}
                Icon={faSearch}
                placeholder="Search"
              />
            </div>

            <div className="lg:hidden">
              <DrawerMobileNavigation
                mode={props.mode}
              ></DrawerMobileNavigation>
            </div>
            {openS && (
              <div className="">
                <Input
                  value={term}
                  onChange={(e) => {
                    // @ts-ignore
                    setTerm(e.value);
                  }}
                  id="searchInp"
                  onKeyUp={(p) => onPressEnter("searchInp", p.key)}
                  onClickIcon={() => setOpenS(false)}
                  Icon={faX}
                  placeholder="Search"
                  className={
                    "w-0 duration-300 " + (changeW ? "!w-[225px]" : "w-0")
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
