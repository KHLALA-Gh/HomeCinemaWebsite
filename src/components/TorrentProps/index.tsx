import {
  faCircleInfo,
  faFolderOpen,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pb from "pretty-bytes";

export function TorrentProps({
  name,
  infoHash,
  date,
  size,
  downloadedSize,
  path,
}: TorrentProps) {
  return (
    <div>
      <div className="flex justify-center items-center flex-col gap-3">
        <div className="glass-dark p-5 rounded-2xl mb-2">
          <FontAwesomeIcon icon={faFolderOpen} className="" size="2xl" />
        </div>
        <h1 className="text-center font-bold">{name}</h1>
        <p
          onClick={(t) => {
            //@ts-ignore

            if (t.target.textContent === "Copied ✔") return;
            navigator.clipboard.writeText(infoHash);
            //@ts-ignore
            t.target.textContent = "Copied ✔";
            setTimeout(() => {
              //@ts-ignore

              t.target.textContent = infoHash;
            }, 5000);
          }}
          className="select-none min-w-[400px] text-center glass rounded-2xl p-2 w-fit duration-200 cursor-pointer hover:scale-105 hover:ps-3 hover:pr-3"
        >
          {infoHash}
        </p>{" "}
        <span className="bg-pop pt-2 pb-2 ps-5 pr-5 rounded-2xl text-center">
          {pb(size || 0)}
        </span>
      </div>
      <div className="p-7">
        <div className="rounded-2xl bg-pop mt-5 bg-[#151515]">
          <div className="p-3 border-b border-b-white">
            <p className="text-white/50">Torrent Path</p>

            <h1 className="text-sm wrap-anywhere">{path}</h1>
          </div>
          <div className="p-3 border-b border-b-white">
            <p className="text-white/50">Download Date</p>
            <h1>{formatUnixTime(date)}</h1>
          </div>
          <div className="p-3">
            <p className="text-white/50">Downloaded Size</p>
            <h1>{pb(downloadedSize || 0)}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
function formatUnixTime(unixTime: number) {
  const date = new Date(unixTime);

  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}
