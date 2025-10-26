import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import Home from "../../pages/Home";
import Watch from "../../pages/Watch";
import Search from "../../pages/Search";
import MoviePage from "../../pages/Movie";
import Play from "../../pages/Play";
import TVShows from "../../pages/TV_Shows";
import Show from "../../pages/Show";
import TorrentFiles from "../../pages/TorrentFiles";
import { useEffect } from "react";
import PreStreams from "../../pages/PreStreams";
import Torrents from "../../pages/Torrents";
import Saved from "../../pages/Saved";
import SavedMovie from "../../pages/Saved/movie";
import SavedTVShows from "../../pages/Saved/TVShows";

function Root() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home_cinema");
  }, []);
  return <></>;
}

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/home_cinema" element={<Home />} />
          <Route path="/home_cinema/watch" element={<Watch />} />
          <Route path="/home_cinema/search" element={<Search />} />
          <Route path="/home_cinema/watch/:id" element={<MoviePage />} />
          <Route path="/home_cinema/watch/:id/play/:hash" element={<Play />} />
          <Route path="/home_cinema/watch_tv_shows/" element={<TVShows />} />
          <Route path="/home_cinema/tv_shows/:id" element={<Show />} />
          <Route
            path="/home_cinema/torrents/:hash/files"
            element={<TorrentFiles />}
          />
          <Route path="/home_cinema/torrents/" element={<Torrents />} />
          <Route path="/home_cinema/streams" element={<PreStreams />} />
          <Route path="/home_cinema/saved" element={<Saved />} />
          <Route
            path="/home_cinema/saved/movies/:id"
            element={<SavedMovie />}
          />
          <Route
            path="/home_cinema/saved/show/:id"
            element={<SavedTVShows />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
