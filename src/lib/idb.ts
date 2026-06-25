import { openDB } from "idb";
import { fetchConfigs } from "../hooks/getMagnetURI";

enum ObjectStores {
  MOVIES = "saved_movies",
  TVSHOWS = "saved_tvshows",
  TORRENTS = "torrents",
  DOWNLOADS = "downloads",
}

class ElectronStore {
  constructor() {}
  async getAll(storeName: string): Promise<any> {
    if (storeName === ObjectStores.MOVIES)
      return Array.from((await window.electron.getSavedMovies()).values());
    if (storeName === ObjectStores.TVSHOWS)
      return Array.from((await window.electron.getSavedShows()).values());
    if (storeName === ObjectStores.TORRENTS)
      return Array.from((await window.electron.getSavedTorrents()).values());
  }
  async put(storeName: string, data: any): Promise<any> {
    if (storeName === ObjectStores.MOVIES)
      return await window.electron.saveMovie(data);
    if (storeName === ObjectStores.TVSHOWS)
      return await window.electron.saveShow(data);
    if (storeName === ObjectStores.TORRENTS)
      return await window.electron.saveTorrent(data);
  }
  async get(storeName: string, id: any): Promise<any> {
    if (storeName === ObjectStores.MOVIES)
      return await window.electron.getSavedMovie(id);
    if (storeName === ObjectStores.TVSHOWS)
      return await window.electron.getSavedShow(id);
    if (storeName === ObjectStores.TORRENTS)
      return await window.electron.getSavedTorrent(id);
  }
  async delete(storeName: string, id: any): Promise<any> {
    if (storeName === ObjectStores.MOVIES)
      return await window.electron.deleteSavedMovie(id);
    if (storeName === ObjectStores.TVSHOWS)
      return await window.electron.deleteSavedShow(id);
    if (storeName === ObjectStores.TORRENTS)
      return await window.electron.deleteSavedTorrent(id);
  }
}

const dbPromise = (async () => {
  const configs = await fetchConfigs();
  if (!configs.desktopMode)
    return await openDB("data", 1, {
      upgrade(db) {
        db.createObjectStore(ObjectStores.MOVIES, { keyPath: "id" }); // use movie.id as key
        db.createObjectStore(ObjectStores.TVSHOWS, { keyPath: "id" }); // use tv.id as key
        db.createObjectStore(ObjectStores.TORRENTS, { keyPath: "infoHash" }); // use tv.infoHash as key
        db.createObjectStore(ObjectStores.DOWNLOADS, { keyPath: "infoHash" }); // use infoHash as key
      },
    });
  return new ElectronStore();
})();

export async function addMovie(movie: MovieSavedData) {
  const db = await dbPromise;
  db.put(ObjectStores.MOVIES, movie);
}

export async function getMovies(): Promise<MovieSavedData[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.MOVIES);
}

export async function getMovieById(id: number): Promise<MovieSavedData> {
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

export async function addDownload(d: Download) {
  const db = await dbPromise;
  db.put(ObjectStores.DOWNLOADS, d);
}

export async function getDownloads(): Promise<Download[]> {
  const db = await dbPromise;
  return await db.getAll(ObjectStores.DOWNLOADS);
}

export async function getDownloadByInfoHash(
  infoHash: string,
): Promise<Download> {
  const db = await dbPromise;
  return await db.get(ObjectStores.DOWNLOADS, infoHash);
}

export async function removeDownload(infoHash: string) {
  const db = await dbPromise;
  await db.delete(ObjectStores.DOWNLOADS, infoHash);
}
