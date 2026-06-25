import img from "../../assets/imgs/home_img.webp";
import Button from "../../components/Button/button";
import { FloatingDiv } from "../../components/Utils/floating-div";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
  const [showSetLibrary, setShowLibrary] = useState(false);
  useEffect(() => {
    window.electron.getLibSet().then((v) => {
      setShowLibrary(!v);
    });
  }, []);
  return (
    <>
      {showSetLibrary && (
        <FloatingDiv
          onClose={() => {
            setShowLibrary(false);
          }}
          blur
        >
          <div className="flex justify-center items-center flex-col gap-5">
            <div className="p-5 bg-black/50 bg-pop rounded-2xl">
              <FontAwesomeIcon size="xl" icon={faFolderOpen} />
            </div>

            <h1 className="font-bold text-lg">
              {" "}
              Choose your new Library location !{" "}
            </h1>
            <p className="text-white/50">
              A place on your pc to save your movies and TV shows.
            </p>
            <Button
              onClick={async () => {
                let path = await window.electron.selectFolder();
                if (!path) return;
                await window.electron.changeDHDir(path);
                window.electron.setLibSet(true);

                setShowLibrary(false);
              }}
            >
              choose location
            </Button>
            <p
              onClick={() => {
                window.electron.setLibSet(true);
                setShowLibrary(false);
              }}
              className="cursor-pointer text-blue-600"
            >
              dont show again
            </p>
          </div>
        </FloatingDiv>
      )}
      <div className="flex justify-center xl:justify-between md:ps-32 md:pr-32 relative mt-28">
        <div className="xl:z-30 z-10 absolute rounded-full duration-[2000ms] bg-[#000000] xl:bg-[#ffffffa9] opacity-40 xl:opacity-20 hover:opacity-15 w-[200px] h-[200px]  sm:w-[500px] sm:h-[500px] blur-[253px] pointer-events-none lg:top-[75px] lg:left-[300px]"></div>
        <div className="z-20 md:mt-[15%] mt-[30%] translate-y-[-30%]">
          <h1 className="md:text-7xl text-5xl font-black text-white">
            Watch Movies <br /> In Your Home
          </h1>
          <div className="flex gap-5 mt-16">
            <Button
              className="sm:text-lg text-sm"
              onClick={() => {
                location.href = "/home_cinema/watch";
              }}
            >
              Movies
            </Button>
            <Button
              onClick={() => {
                location.href = "/home_cinema/watch_tv_shows";
              }}
              className="!bg-transparent border-4 text-white border-white sm:text-lg text-sm"
            >
              TV Shows
            </Button>
          </div>
        </div>
        <div className="md:mr-10 xl:relative sm:left-auto sm:top-auto z-0 left-0 top-20 absolute">
          <img src={img} className="h-[588px]" alt="" />
        </div>
      </div>
    </>
  );
}
