import { faFilm, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input/Input";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import DrawerMobileNavigation from "./drawer";
import img from "../../assets/imgs/icon.png";
import { fetchConfigs } from "../../hooks/getMagnetURI";

interface NavbarProps {
  mode?: "Movies" | "TV";
}

const links = [
  {
    to: "/home_cinema/downloads",
    name: "Downloads",
  },
  { to: "/home_cinema/torrents", name: "Torrents" },
  { to: "/home_cinema/saved", name: "Saved" },
];

export default function NavBar(props: NavbarProps) {
  const [openS, setOpenS] = useState(false);
  const [changeW, setChangeW] = useState(false);
  const [searchP] = useSearchParams();
  const [term, setTerm] = useState("");
  const [version, setVersion] = useState<Version>();
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
  useEffect(() => {
    fetchConfigs().then((c) => {
      setVersion(c.version);
    });
  }, []);
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
      <div className="flex z-999  sticky top-8 justify-center items-center">
        <div
          className={
            " items-center relative w-[80%] flex justify-between rounded-full p-3 glass-light "
          }
        >
          {!openS && (
            <Link
              to={
                !props.mode
                  ? "/home_cinema/"
                  : props.mode === "Movies"
                    ? "/home_cinema/watch"
                    : "/home_cinema/watch_tv_shows"
              }
            >
              <div>
                <div className="flex items-center gap-4">
                  <img src={img} className="lg:h-12 h-9" />
                  <h1 className="lg:text-xl font-black">
                    Home Cinema
                    <p
                      title={`Version : ${version?.semVer}`}
                      className="text-sm font-semibold p-0 text-green-600 rounded-full"
                    >
                      {version?.name}
                    </p>
                  </h1>
                </div>
              </div>
            </Link>
          )}
          <div className="flex justify-center xl:gap-20 gap-6 items-center text-base">
            <Link
              to={
                props.mode === "Movies" || !props.mode
                  ? "/home_cinema/watch_tv_shows"
                  : "/home_cinema/watch"
              }
              className={
                "font-bold lg:block hidden " +
                (location.pathname === "/home_cinema/watch_tv_shows" ||
                location.pathname === "/home_cinema/watch"
                  ? "glass-white text-black p-3 bg-white/25 rounded-full"
                  : "")
              }
            >
              {props.mode === "TV" && <>Movies</>}
              {(props.mode === "Movies" || !props.mode) && <>TV Shows</>}
            </Link>
            {links.map((l) => {
              return (
                <Link
                  to={l.to}
                  className={
                    "font-bold lg:block hidden " +
                    (location.pathname === l.to
                      ? "glass-white p-3 text-black bg-white/25 rounded-full"
                      : "")
                  }
                >
                  {l.name}
                </Link>
              );
            })}

            <div className="md:block hidden">
              <Input
                value={term}
                id="searchInp1"
                className="!w-[150px] border-none! outline-none!"
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
