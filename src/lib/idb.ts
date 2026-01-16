import { openDB } from "idb";

enum ObjectStores {
  MOVIES = "saved_movies",
  TVSHOWS = "saved_tvshows",
  TORRENTS = "torrents",
}

const dbPromise = openDB("data", 1, {
  upgrade(db) {
    db.createObjectStore(ObjectStores.MOVIES, { keyPath: "id" }); // use movie.id as key
    db.createObjectStore(ObjectStores.TVSHOWS, { keyPath: "id" }); // use tv.id as key
    db.createObjectStore(ObjectStores.TORRENTS, { keyPath: "infoHash" }); // use tv.infoHash as key
  },
});

export async function addMovie(movie: MovieMetaData) {
  const db = await dbPromise;
  db.put(ObjectStores.MOVIES, movie);
}

export async function getMovies(): Promise<MovieMetaData[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.MOVIES);
}

export async function getMovieById(id: number): Promise<MovieMetaData> {
  const db = await dbPromise;
  return await db.get(ObjectStores.MOVIES, id);
}

export async function removeMovie(id: number) {
  const db = await dbPromise;
  await db.delete(ObjectStores.MOVIES, id);
}

export async function addTVShow(tv: TMDBTVShow) {
  const db = await dbPromise;
  db.put(ObjectStores.TVSHOWS, tv);
}

export async function getTVShows(): Promise<TMDBTVShow[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.TVSHOWS);
}

export async function getTVShowById(id: number): Promise<TMDBTVShow> {
  const db = await dbPromise;
  return await db.get(ObjectStores.TVSHOWS, id);
}

export async function removeTVShow(id: number) {
  const db = await dbPromise;
  await db.delete(ObjectStores.TVSHOWS, id);
}

export async function addTorrents(t: TorrentSearch) {
  const db = await dbPromise;
  db.put(ObjectStores.TORRENTS, t);
}

export async function getTorrents(): Promise<TorrentSearch[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.TORRENTS);
}

export async function getTorrentByInfoHash(
  infoHash: string,
): Promise<TorrentSearch> {
  const db = await dbPromise;
  return await db.get(ObjectStores.TORRENTS, infoHash);
}

export async function removeTorrent(infoHash: string) {
  const db = await dbPromise;
  await db.delete(ObjectStores.TORRENTS, infoHash);
}
