import { openDB } from "idb";

enum ObjectStores {
  MOVIES = "saved_movies",
  TVSHOWS = "saved_tvshows",
}

const dbPromise = openDB("user-data", 1, {
  upgrade(db) {
    db.createObjectStore(ObjectStores.MOVIES, { keyPath: "id" }); // use movie.id as key
    db.createObjectStore(ObjectStores.TVSHOWS, { keyPath: "id" }); // use tv.id as key
  },
});

export async function addMovie(movie: MovieDetails) {
  const db = await dbPromise;
  db.put(ObjectStores.MOVIES, movie);
}

export async function getMovies(): Promise<MovieDetails[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.MOVIES);
}

export async function getMovieById(id: number): Promise<MovieDetails> {
  const db = await dbPromise;
  return await db.get(ObjectStores.MOVIES, id);
}

export async function removeMovie(id: number) {
  const db = await dbPromise;
  await db.delete(ObjectStores.MOVIES, id);
}

export async function addTVShow(tv: TMDBTVShowDetails) {
  const db = await dbPromise;
  db.put(ObjectStores.TVSHOWS, tv);
}

export async function getTVShows(): Promise<TMDBTVShowDetails[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.TVSHOWS);
}

export async function getTVShowById(id: number): Promise<TMDBTVShowDetails> {
  const db = await dbPromise;
  return await db.get(ObjectStores.TVSHOWS, id);
}

export async function removeTVShow(id: number) {
  const db = await dbPromise;
  await db.delete(ObjectStores.TVSHOWS, id);
}
