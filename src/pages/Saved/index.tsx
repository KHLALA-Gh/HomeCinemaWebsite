import { useEffect, useState } from "react";
import { getTorrents, getTVShows } from "../../lib/idb";
import Movie from "../../components/Movie/Movie";
import Show from "../../components/Show";
import { useSavedMovies } from "../../hooks/useSavedMovies";
import NavBar from "../../components/Navbar";
import { Torrent } from "../../components/Show_Details";
import Input from "../../components/Input/Input";
import Fuse from "fuse.js";
type dataCode = "mv" | "tv" | "tr";
interface typeData {
  name: string;
  code: dataCode;
}

const data: typeData[] = [
  {
    name: "Movie",
    code: "mv",
  },
  {
    name: "TV Show",
    code: "tv",
  },
  {
    name: "Torrents",
    code: "tr",
  },
];
function grepLike(pattern: string, text: string) {
  const safe = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(safe, "i").test(text);
}
export default function Saved() {
  const [selectedData, setSelectedData] = useState<dataCode>("mv");
  const mvDetails = useSavedMovies();
  const [tvShows, setTVShow] = useState<TMDBTVShow[]>();
  const [torrents, setTorrents] = useState<TorrentSearch[]>([]);
  const [SearchTorrent, setTorrentSearch] = useState<string>("");
  const search = () => {
    if (!SearchTorrent.trim()) return torrents;
    const fuse = new Fuse(torrents, {
      keys: ["name"],
      threshold: 0.5,
      ignoreLocation: true,
      includeScore: true,
    });
    return fuse
      .search(SearchTorrent.trim())
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map((t) => t.item);
  };
  useEffect(() => {
    if (selectedData === "tv") {
      getTVShows().then((tv) => {
        setTVShow(tv);
      });
    } else if (selectedData === "tr") {
      getTorrents().then((t) => {
        console.log(t);
        setTorrents(t);
      });
    }
  }, [selectedData]);
  return (
    <>
      <NavBar />
      <div className="p-10">
        <h1 className="text-2xl font-bold">Offline Saved Data</h1>
        <div className="flex gap-5 text-sm mt-5 mb-5">
          {data.map((d, i) => {
            return (
              <div
                key={i}
                onClick={() => setSelectedData(d.code)}
                className={
                  `cursor-pointer` +
                  (selectedData === d.code
                    ? " underline-offset-2 underline font-bold"
                    : "")
                }
              >
                <p>{d.name}</p>
              </div>
            );
          })}
        </div>
        {selectedData === "mv" ? (
          <div className="flex gap-5 flex-wrap">
            {mvDetails?.map((m, i) => {
              return (
                <Movie
                  key={i}
                  m={{
                    id: m.id,
                    title: m.title,
                    year: m.year,
                    rating: m.rating,
                    medium_cover_image: m.medium_cover_image,
                    runtime: m.runtime?.toString(),
                  }}
                />
              );
            })}
            {mvDetails?.length === 0 && (
              <CenteredMessage msg="No saved movies" />
            )}
          </div>
        ) : selectedData === "tv" ? (
          <div className="flex gap-5 flex-wrap">
            {tvShows?.map((m, i) => {
              return (
                <Show
                  key={i}
                  to={`/home_cinema/tv_shows/${m.id}`}
                  show={{
                    id: m.id,
                    name: m.name,
                    first_air_date: m.first_air_date,
                    vote_average: m.vote_average,
                    poster_path: m.poster_path,
                    backdrop_path: m.backdrop_path,
                    origin_country: m.origin_country,
                    genre_ids: [],
                  }}
                />
              );
            })}
            {tvShows?.length === 0 && (
              <CenteredMessage msg="No saved TV shows" />
            )}
          </div>
        ) : (
          <div>
            <div className="mt-10 mb-3">
              <Input
                placeholder="search"
                value={SearchTorrent}
                onChange={(e) => {
                  setTorrentSearch(e.target.value);
                }}
                className="max-w-[200px]!"
              />
            </div>
            {search().map((t) => {
              return <Torrent t={t} />;
            })}
            {torrents?.length === 0 && (
              <CenteredMessage msg="No saved torrents" />
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CenteredMessage({ msg }: { msg: string }) {
  return (
    <div className="flex opacity-50 justify-center items-center w-full h-screen absolute top-0 left-0 -z-10">
      <h1>{msg}</h1>
    </div>
  );
}
