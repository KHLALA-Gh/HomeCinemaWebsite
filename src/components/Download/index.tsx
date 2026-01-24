import pr from "pretty-bytes";

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
