import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { Alert } from "@mui/material";
import { useTorrentSearch } from "../../hooks/getTorrentSearch";
import { Torrent } from "../../components/Show_Details";
export default function Torrents() {
  const [query, setQuery] = useState<string>();
  const { resp, isLoading, err, fetch } = useTorrentSearch();

  return (
    <>
      <NavBar />
      <div className="lg:ms-32 mt-24">
        <h1 className="text-2xl font-bold mb-5">Search torrents</h1>
        <Input
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !isLoading) {
              fetch(query as string);
            }
          }}
          value={query}
          sx={{
            width: "auto",
            maxWidth: "600px",
          }}
          color="neutral"
          size="lg"
          variant="soft"
          placeholder="Search query"
        />
        <div className="mt-5">
          <Button
            color="neutral"
            loading={isLoading}
            onClick={function () {
              fetch(query as string);
            }}
            variant="soft"
            size="lg"
          >
            Search
          </Button>
        </div>
        {err && (
          <Alert
            severity="error"
            variant="outlined"
            className="w-fit! mt-5! text-red-500!"
            color="error"
          >
            An error occurred : {err}
          </Alert>
        )}
      </div>
      <div className="mt-5 p-5">
        <div className="min-h-5">
          {(isLoading || resp?.length) && (
            <p>found {resp?.length || 0} torrents</p>
          )}
        </div>
        {resp
          ?.sort((a, b) => (b.seeders || 0) - (a.seeders || 0))
          .map((t, i) => {
            return <Torrent key={i} t={t} />;
          })}
      </div>
    </>
  );
}
