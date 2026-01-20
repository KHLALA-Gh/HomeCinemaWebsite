import { useEffect, useState } from "react";
import { useGetDownloads } from "../../hooks/getDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPause,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDeleteDownload } from "../../hooks/deleteStream";
import NavBar from "../../components/Navbar";
import { Alert } from "@mui/material";
import { usePauseDownload } from "../../hooks/usePauseDownload";
import pr from "pretty-bytes";
export default function PreStreams() {
  const { resp, err, isLoading, fetch } = useGetDownloads();
  const { fetch: fetchPause } = usePauseDownload();
  const { fetch: fetchDel } = useDeleteDownload();
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
            {resp.map((s: Download, i: number) => {
              return (
                <Download
                  onClickDel={() => {
                    fetchDel(s.infoHash);
                  }}
                  key={i}
                  onClickPause={() => {
                    fetchPause(s.infoHash);
                  }}
                  download={s}
                />
              );
            })}
          </div>
        )}
        {}
      </div>
    </>
  );
}

function Download({
  download,
  onClickDel,
  onClickPause,
}: {
  download: Download;
  onClickDel: () => any;
  onClickPause: () => any;
}) {
  return (
    <div className="hover:bg-[#50505059] md:p-5 p-2 rounded-md">
      <div
        onClick={onClickDel}
        className="border-2 cursor-pointer ms-[100%] translate-x-[-100%] border-red-600 w-fit ps-[4px] pr-[4px] rounded-md"
      >
        <FontAwesomeIcon icon={faXmark} className="text-red-600" />
      </div>
      <div
        onClick={onClickPause}
        className="border-2 cursor-pointer ms-[100%] translate-x-[-100%] border-red-600 w-fit ps-[4px] pr-[4px] rounded-md"
      >
        <FontAwesomeIcon icon={faPause} className="text-yellow-600" />
      </div>
      <div className="lg:flex gap-5 items-center p-5  rounded-md cursor-pointer">
        <div>
          <a
            className="font-bold md:text-lg"
            href={`/home_cinema/torrents/${download.infoHash}/files`}
            target="_blank"
          >
            {download.name}
          </a>
          <div className="flex items-center">
            <p>
              <FontAwesomeIcon icon={faUpload} /> {pr(+download.upSpeed)}
            </p>
            <p>
              <FontAwesomeIcon icon={faDownload} /> {pr(+download.downSpeed)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-[200px] relative bg-white h-2 rounded-full">
            <div
              style={{
                width: `${(download.progress * 100).toFixed()}%`,
              }}
              className={`h-2 bg-green-600 rounded-full`}
            ></div>
          </div>

          <p>{(download.progress * 100).toFixed(2)}%</p>
        </div>
        {/* <Button
          className="!text-sm !ps-5 !pr-5 flex items-center"
          onClick={() => {
            navigator.clipboard.writeText(download.streamUrl);
          }}
        >
          <FontAwesomeIcon icon={faCopy} className="h-5 mr-2" />
          Copy Stream URL
        </Button> */}
      </div>
    </div>
  );
}
