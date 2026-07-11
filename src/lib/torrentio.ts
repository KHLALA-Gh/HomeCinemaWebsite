import axios from "axios";

export async function getMovieStreams(imdbID: string): Promise<TorrentioResp> {
  const url = `https://torrentio.strem.fun/stream/movie/${imdbID}.json`;

  const res = await axios.get(url);
  return res.data;
}

export async function getTvStreams(
  imdbID: string,
  season: number,
  episode: number,
): Promise<TorrentioResp> {
  const url = `https://torrentio.strem.fun/stream/series/${imdbID}:${season}:${episode}.json`;

  const res = await axios.get(url);
  return res.data;
}
