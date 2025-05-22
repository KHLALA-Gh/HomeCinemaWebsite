import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { TorrentFiles } from "../../components/TorrentFiles";
import { useTorrentFiles } from "../../hooks/useTorrentFiles";
import { Alert } from "@mui/material";
export default function Torrents() {
  const [hash, setHash] = useState<string>();
  const { resp, isLoading, err, fetch } = useTorrentFiles();

  return (
    <>
      <NavBar />
      <div className="lg:ms-32 mt-24">
        <h1 className="text-2xl font-bold mb-5">Get torrent By Info Hash</h1>
        <Input
          onChange={(e) => {
            setHash(e.target.value);
          }}
          value={hash}
          sx={{
            width: "auto",
            maxWidth: "600px",
          }}
          color="neutral"
          size="lg"
          variant="soft"
          placeholder="Info Hash"
        />
        <div className="mt-5">
          <Button
            color="neutral"
            loading={isLoading}
            onClick={function () {
              fetch(hash as string);
            }}
            variant="soft"
            size="lg"
          >
            Get
          </Button>
        </div>
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
      </div>
      <div className="mt-5">
        {!isLoading && !err && resp && (
          <TorrentFiles
            isLoading={isLoading}
            err={err}
            resp={resp}
            hash={hash || ""}
          />
        )}
      </div>
    </>
  );
}
