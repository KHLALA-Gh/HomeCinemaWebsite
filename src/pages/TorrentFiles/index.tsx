import { useParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPlay } from "@fortawesome/free-solid-svg-icons";
export default function TorrentFiles() {
  const p = useParams();
  const { resp, isLoading, err } = useTorrentFiles(p.hash as string);

  function downloadVLCPlaylist(name: string, url: string) {
    const playlist = `#EXTM3U\n#EXTINF:-1,${name}\n${url}`;
    const blob = new Blob([playlist], { type: "audio/x-mpegurl" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name}.m3u`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      {!err &&
        !isLoading &&
        resp?.map((file, i) => {
          return (
            <div
              key={i}
              className="p-5 hover:bg-slate-400 duration-200 flex gap-10 cursor-pointer flex-wrap"
            >
              <h1
                onClick={() => {
                  open(file.downloadLink, "_blank");
                }}
              >
                {file.name}
              </h1>
              <p>{pr(file.size)}</p>
              {(file.name.endsWith(".mp4") || file.name.endsWith(".mkv")) && (
                <button
                  onClick={() => {
                    downloadVLCPlaylist(file.name, file.downloadLink);
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(file.downloadLink);
                }}
              >
                <FontAwesomeIcon icon={faCopy} /> Copy Stream URL
              </button>
            </div>
          );
        })}
      {isLoading && <h1>Loading files ...</h1>}
      {err && (
        <h1 className="text-red-500">An error occurred while getting files</h1>
      )}
      {resp?.length === 0 && !isLoading && (
        <h1>No files found. It could be 0 seeders</h1>
      )}
    </>
  );
}
