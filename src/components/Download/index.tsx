import pr from "pretty-bytes";
import { useEffect, useState } from "react";
import Button from "../Button/button";

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
  selectAll?: boolean;
}
export function SelectFiles({ files, onSet, onError }: SelectFilesProps) {
  const [editFiles, setEditFiles] = useState<DownloadFile[]>([]);
  useEffect(() => {
    setEditFiles([...files]);
  }, []);
  const onSelectFile = (f: DownloadFile) => {
    f.selected = !f.selected;
    setEditFiles([...editFiles]);
  };

  return (
    <div className="rounded-md p-3 max-h-[80vh] bg-[#161616] min-w-[400px] select-none">
      <h1 className="text-xl font-bold mb-3">Files</h1>
      <div className="overflow-y-scroll  max-h-[60vh]">
        {editFiles &&
          editFiles.map((f, i) => {
            const maxChars = f.paused ? 20 : 31;
            const fullName = f.path.split("/").at(-1);
            let shortName = f.path.split("/").at(-1)?.slice(0, maxChars);

            shortName +=
              (shortName?.length || 0) >= maxChars
                ? "..." + fullName?.slice(fullName.length - 3)
                : "";
            return (
              <div
                onClick={() => {
                  onSelectFile(f);
                }}
                key={i}
                className="grid cursor-pointer grid-cols-12 items-center justify-center mb-3"
              >
                <h1
                  className={`${f.paused ? "col-span-7" : "col-span-9"} md:text-base text-[12px] wrap-break-word`}
                  title={fullName}
                >
                  {shortName}
                </h1>
                <p className="col-span-2 md:text-base text-[12px]">
                  {pr(f.size) || 0}
                </p>
                <div className="flex items-center">
                  <input
                    checked={f.selected}
                    type="checkbox"
                    className="scale-150"
                  />
                </div>
                {f.paused && (
                  <div className="col-span-2 flex justify-center">
                    <p className="rounded-full md:ps-3 md:pr-3 p-1 pb-1 md:pt-2 text-[9px] md:pb-2 md:text-sm text-yellow-600 font-bold border-yellow-600 border-2">
                      paused
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="flex items-center justify-between mt-3">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (!editFiles.length) return;
            let arr = editFiles.map((f) => {
              return {
                ...f,
                selected:
                  !(
                    editFiles.filter((f) => f.selected).length ===
                    editFiles.length
                  ) || false,
              };
            });
            setEditFiles(arr);
          }}
        >
          select all{" "}
          <input
            type="checkbox"
            className="scale-150 ms-2"
            checked={
              editFiles.filter((f) => f.selected).length === editFiles.length
            }
          />
        </div>
        <Button
          onClick={async () => {
            try {
              if (!onSet) return;
              await onSet(editFiles);
            } catch (err) {
              if (onError) onError(err);
            }
          }}
          className="text-base! ps-8! pr-8! rounded-xl! pt-2! pb-2!"
        >
          Set
        </Button>
      </div>
    </div>
  );
}
