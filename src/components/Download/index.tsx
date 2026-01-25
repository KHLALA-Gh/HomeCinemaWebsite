import pr from "pretty-bytes";
import { useEffect, useState } from "react";
import Button from "../Button/button";
import axios from "axios";
import { fetchConfigs } from "../../hooks/getMagnetURI";

export function DownloadBar({
  download,
}: {
  download: {
    downloaded: number;
    size: number;
  };
}) {
  return (
    <div>
      <div>
        {pr(download.downloaded || 0)} / {pr(download.size || 0)}
      </div>
      <div className="flex items-center gap-5">
        <div className="w-[200px] relative bg-white h-2 rounded-full">
          <div
            style={{
              width: `${(
                ((download.downloaded || 0) / (download.size || 1)) *
                100
              ).toFixed(2)}%`,
            }}
            className={`h-2 bg-green-600 rounded-full`}
          ></div>
        </div>

        <p>
          {(((download.downloaded || 0) / (download.size || 1)) * 100).toFixed(
            2,
          )}
          %
        </p>
      </div>
    </div>
  );
}

interface SelectFilesProps {
  files: DownloadFile[];
  infoHash: string;
  onSet?: (files: DownloadFile[]) => void;
  onError?: (err: any) => void;
}
export function SelectFiles({
  files,
  infoHash,
  onSet,
  onError,
}: SelectFilesProps) {
  const [editFiles, setEditFiles] = useState<DownloadFile[]>([]);
  useEffect(() => {
    setEditFiles([...files]);
  }, []);
  const onSelectFile = (f: DownloadFile) => {
    f.selected = !f.selected;
    setEditFiles([...editFiles]);
  };

  const selectFiles = async () => {
    const configs = await fetchConfigs();

    const url = new URL(
      `/api/downloads/${infoHash}/files`,
      configs["torrent-streamer-api"].external
        ? configs["torrent-streamer-api"].origin
        : location.origin,
    );
    const resp = await axios.put(url.href, {
      selectedFiles: editFiles.map((f) => (f.selected ? f.path : "")),
    });
    if (resp.status === 200) {
      if (onSet) onSet(editFiles);
    }
  };
  return (
    <div className="rounded-md p-3 border-2 border-white bg-black">
      <h1 className="text-xl font-bold mb-3">Files</h1>
      {editFiles &&
        editFiles.map((f, i) => {
          return (
            <div
              onClick={() => {
                onSelectFile(f);
              }}
              key={i}
              className="grid cursor-pointer grid-cols-12 items-center mb-3"
            >
              <h1 className="col-span-7">
                {f.path.split("/").at(-1)?.slice(0) +
                  (f.path.split("/").at(-1)?.length || 0 > 50 ? "..." : "")}
              </h1>
              <p className="col-span-2">{pr(f.size) || 0}</p>
              <div className="flex items-center">
                <input
                  checked={f.selected}
                  onChange={() => onSelectFile(f)}
                  type="checkbox"
                  className="scale-150"
                />
              </div>
              {f.paused && (
                <div className="col-span-2 flex justify-center">
                  <p className="rounded-full ps-3 pr-3 pt-2 pb-2 text-sm text-yellow-600 font-bold border-yellow-600 border-2">
                    paused
                  </p>
                </div>
              )}
            </div>
          );
        })}
      <Button
        onClick={async () => {
          try {
            if (!onSet) return;
            await selectFiles();
          } catch (err) {
            if (onError) onError(err);
          }
        }}
        className="ms-[100%] translate-x-[-100%] text-base! ps-8! pr-8! rounded-xl! pt-2! pb-2! mt-5"
      >
        Set
      </Button>
    </div>
  );
}
