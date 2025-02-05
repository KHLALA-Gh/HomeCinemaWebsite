import { useParams } from "react-router";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import pr from "pretty-bytes";
export default function TorrentFiles() {
  const p = useParams();
  const { resp, isLoading, err } = useTorrentFiles(p.hash as string);
  return (
    <>
      {!err &&
        !isLoading &&
        resp?.map((file, i) => {
          return (
            <div
              onClick={() => {
                open(file.downloadLink, "_blank");
              }}
              key={i}
              className="p-5 hover:bg-slate-400 duration-200 flex gap-10 cursor-pointer flex-wrap"
            >
              <h1>{file.name}</h1>
              <p>{pr(file.size)}</p>
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
