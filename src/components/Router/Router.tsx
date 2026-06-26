import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import Home from "../../pages/Home";
import Watch from "../../pages/Watch";
import Search from "../../pages/Search";
import MoviePage from "../../pages/Movie";
import Play from "../../pages/Play";
import TVShows from "../../pages/TV_Shows";
import Show from "../../pages/Show";
import TorrentFiles from "../../pages/TorrentFiles";
import { useEffect, useState } from "react";
import Downloads from "../../pages/Downloads";
import Torrents from "../../pages/Torrents";
import Saved from "../../pages/Saved";
import { NotFound } from "../../pages/404";
import NewUpdate from "../../pages/new-update";
import History from "../../pages/History";
import Nav from "../Navbar/Nav";
import { Search as SearchInp } from "../Navbar/index";

function Root() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home_cinema");
  }, []);
  return <></>;
}
function Layout() {
  const [showSearch, setShowSearch] = useState(true);
  return (
    <>
      <Nav
        onHover={() => setShowSearch(false)}
        onMouseLeave={() => setShowSearch(true)}
        onExtend={() => setShowSearch(false)}
        onMinimize={() => setShowSearch(true)}
      />

      <div className="mt-25">
        <Outlet />
      </div>
      <div
        className={
          "fixed top-6 left-30 z-9999 duration-300 " +
          (showSearch ? "opacity-100" : "opacity-0")
        }
      >
        <SearchInp />
      </div>
    </>
  );
}
export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Root />} />
            <Route path="/home_cinema" element={<Home />} />
            <Route path="/home_cinema/watch" element={<Watch />} />
            <Route path="/home_cinema/search" element={<Search />} />
            <Route path="/home_cinema/watch/:id" element={<MoviePage />} />
            <Route
              path="/home_cinema/watch/:id/play/:hash"
              element={<Play />}
            />
            <Route path="/home_cinema/watch_tv_shows/" element={<TVShows />} />
            <Route path="/home_cinema/tv_shows/:id" element={<Show />} />
            <Route
              path="/home_cinema/torrents/:hash/files"
              element={<TorrentFiles />}
            />
            <Route path="/home_cinema/torrents/" element={<Torrents />} />
            <Route path="/home_cinema/downloads" element={<Downloads />} />
            <Route path="/new-update" element={<NewUpdate />} />
            <Route path="/home_cinema/saved" element={<Saved />} />
            <Route path="/home_cinema/download-history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
