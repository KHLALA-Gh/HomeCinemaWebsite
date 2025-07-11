import { useEffect, useState } from "react";
import { useGetPreStreams } from "../../hooks/getDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDeleteStream } from "../../hooks/deleteStream";
import Button from "../../components/Button/button";
import NavBar from "../../components/Navbar";
import { Alert, LinearProgress } from "@mui/material";

export default function PreStreams() {
  const { resp, err, isLoading, fetch } = useGetPreStreams();
  const {
    resp: respDel,
    err: errDel,
    isLoading: isLoadingDel,
    fetch: fetchDel,
  } = useDeleteStream();
  const [firstTime, setFirstTime] = useState(true);
  useEffect(() => {
    fetch();
    setInterval(() => {
      fetch();
    }, 2000);
  }, []);
  useEffect(() => {
    if (!isLoading) setFirstTime(false);
  }, [isLoading]);
  return (
    <>
      <NavBar />
      <div className="ms-5 mr-5 mt-20">
        {err && (
          <Alert
            severity="error"
            variant="outlined"
            className="!w-fit !mt-5 !text-red-500"
            color="error"
          >
            An error occurred : {err}
          </Alert>
        )}
        {isLoading && firstTime && (
          <div>
            <h1 className="text-center">loading...</h1>
          </div>
        )}
        {resp?.length == 0 && (
          <div className="w-full absolute top-0 h-screen flex justify-center items-center z-[-10] left-0">
            <h1 className="text-lg">There is no pre stream created</h1>
          </div>
        )}
        {resp && (
          <div>
            {resp.map((s: any, i: number) => {
              return (
                <div
                  key={i}
                  className="hover:bg-[#50505059] md:p-5 p-2 rounded-md"
                >
                  <div
                    onClick={() => {
                      fetchDel(s.id as string);
                    }}
                    className="border-2 cursor-pointer ms-[100%] translate-x-[-100%] border-red-600 w-fit ps-[4px] pr-[4px] rounded-md"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                  </div>
                  <div className="lg:flex gap-5 items-center p-5  rounded-md cursor-pointer">
                    <a
                      className="font-bold md:text-lg"
                      href={`/home_cinema/torrents/${s.torrentHash}/files`}
                      target="_blank"
                    >
                      {s.name}
                    </a>
                    <div className="flex items-center gap-5">
                      <div className="w-[200px] relative bg-white h-2 rounded-full">
                        <div
                          style={{
                            width: `${(s.progress * 100).toFixed()}%`,
                          }}
                          className={`h-2 bg-green-600 rounded-full`}
                        ></div>
                      </div>

                      <p>{(s.progress * 100).toFixed(2)}%</p>
                    </div>
                    <Button
                      className="!text-sm !ps-5 !pr-5 flex items-center"
                      onClick={() => {
                        navigator.clipboard.writeText(s.streamUrl);
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} className="h-5 mr-2" />
                      Copy Stream URL
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
