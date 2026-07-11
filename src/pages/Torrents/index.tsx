import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { useTorrentSearch } from "../../hooks/getTorrentSearch";
import { Torrent } from "../../components/Show_Details";
export default function Torrents() {
  const [query, setQuery] = useState<string>("");
  const { resp, isLoading, err, fetch } = useTorrentSearch();
  useEffect(() => {
    console.log(resp, "aaaaaaaaaaaaaaa");
  }, [resp]);
  const search = () => {
    if (!query) return;
    fetch({
      op: "torrent-agent",
      query: query,
    });
  };
  return (
    <>
      <div className="lg:ms-32 ms-8 mt-24">
        <h1 className="text-2xl font-bold mb-5">Search torrents</h1>
        <Input
          className="backdrop-blur-sm! text-white! bg-white/10! shadow-sm! shadow-white/20! inset-shadow-sm! inset-shadow-white/10!"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !isLoading) {
              search();
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
            className={
              "backdrop-blur-sm! bg-white/10! shadow-sm! shadow-white/20! inset-shadow-sm! inset-shadow-white/10! " +
              (isLoading ? "text-transparent!" : " text-white!")
            }
            color="neutral"
            loading={isLoading}
            onClick={search}
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
            An error occurred while searching
          </Alert>
        )}
      </div>
      <div className="mt-5 p-5">
        <div className="min-h-5">
          {(isLoading || resp?.length) && (
            <p>found {resp?.length || 0} torrents</p>
          )}
        </div>
        {resp &&
          resp
            //@ts-ignore
            ?.sort((a, b) => (b.seeders || 0) - (a.seeders || 0))
            .map((t, i) => {
              return <Torrent key={i} t={t} />;
            })}
      </div>
    </>
  );
}
