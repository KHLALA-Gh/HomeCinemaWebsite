import {
  faBars,
  faBookmark,
  faDownload,
  faFile,
  faFilm,
  faFolderOpen,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";
interface NavOps {
  onHover?: () => void;
  onMouseLeave?: () => void;
  onExtend?: () => void;
  onMinimize?: () => void;
  onClickOutside?: () => void;
}
export default function Nav({
  onHover,
  onMouseLeave,
  onExtend,
  onMinimize,
  onClickOutside,
}: NavOps) {
  const [showBigNav, setShowBigNav] = useState(false);
  return (
    <>
      {showBigNav && (
        <div
          className="w-full top-0 h-screen fixed z-9998"
          onClick={() => {
            if (onClickOutside) onClickOutside();
            setShowBigNav(false);
          }}
        ></div>
      )}
      <div
        className={`p-5 fixed  z-9999 top-0 duration-200  ${showBigNav ? "w-[350px] h-screen z-10000" : "w-49 h-16 hover:w-[350px]"}`}
      >
        <div
          onMouseEnter={showBigNav ? () => null : onHover}
          onMouseLeave={showBigNav ? () => null : onMouseLeave}
          className={`
  ${showBigNav ? "max-w-full h-full " : "max-w-16 h-16"}
  overflow-hidden p-5 
   glass-light rounded-2xl
  transition-all duration-200 relative
  hover:max-w-[350px]
`}
        >
          <div className={` absolute flex items-center gap-5`}>
            <div
              className="cursor-pointer"
              onClick={() => {
                if (showBigNav) {
                  if (onMinimize) onMinimize();
                } else {
                  if (onExtend) onExtend();
                }

                setShowBigNav(!showBigNav);
              }}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
            {!showBigNav ? (
              <>
                <IconLink icon={faFilm} link="/home_cinema/watch" />
                <IconLink icon={faTv} link="/home_cinema/watch_tv_shows" />
                <IconLink icon={faDownload} link="/home_cinema/downloads" />
                <IconLink
                  icon={faFolderOpen}
                  link="/home_cinema/download-history"
                />
                <IconLink icon={faBookmark} link="/home_cinema/saved" />
              </>
            ) : (
              <h1 className="font-bold text-xl">Navigation</h1>
            )}
          </div>
          {showBigNav && (
            <div className="flex flex-col gap-3 mt-15">
              <NavLink name="Movie" icon={faFilm} link="/home_cinema/watch" />
              <NavLink
                name="TV Shows"
                icon={faTv}
                link="/home_cinema/watch_tv_shows"
              />
              <NavLink
                name="Downloads"
                icon={faDownload}
                link="/home_cinema/downloads"
              />
              <NavLink
                name="Library"
                icon={faFolderOpen}
                link="/home_cinema/download-history"
              />
              <NavLink
                name="Save"
                icon={faBookmark}
                link="/home_cinema/saved"
              />

              <NavLink
                name="Torrents"
                icon={faFile}
                link="/home_cinema/torrents"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface NavLinkProps {
  link: string;
  name: string;
  icon: any;
}

function IconLink({ icon, link }: { icon: any; link: string }) {
  return (
    <>
      <Link to={link}>
        <div className="cursor-pointer">
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
      </Link>
    </>
  );
}

function NavLink({ link, name, icon }: NavLinkProps) {
  return (
    <>
      <Link to={link}>
        <div className="rounded-lg cursor-pointer p-3 hover:bg-[#b4b4b43e] flex items-center gap-3 pop">
          <div>
            <FontAwesomeIcon icon={icon} />
          </div>
          <h1>{name}</h1>
        </div>
      </Link>
    </>
  );
}
