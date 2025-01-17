import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../../pages/Home";
import Watch from "../../pages/Watch";
import Search from "../../pages/Search";
import MoviePage from "../../pages/Movie";
import Play from "../../pages/Play";
import TVShows from "../../pages/TV_Shows";

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home_cinema" element={<Home />} />
          <Route path="/home_cinema/watch" element={<Watch />} />
          <Route path="/home_cinema/search" element={<Search />} />
          <Route path="/home_cinema/watch/:id" element={<MoviePage />} />
          <Route path="/home_cinema/watch/:id/play/:hash" element={<Play />} />
          <Route path="/home_cinema/watch_tv_shows" element={<TVShows />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
