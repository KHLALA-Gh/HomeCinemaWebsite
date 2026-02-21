export {};

declare global {
  interface Window {
    electron: {
      selectFolder: () => Promise<string | null>;
      openFolder: (path: string) => Promise<void>;
      openVLC: (streams: string[]) => Promise<void>;
      saveMovie(movie: Movie): Promise<void>;
      getSavedMovies(): Promise<[string, Movie][]>;
      getSavedMovie(id: string): Promise<Movie | undefined>;
      deleteSavedMovie(id: string): Promise<void>;

      saveShow(tv: TVShow): Promise<void>;
      getSavedShows(): Promise<[string, TVShow][]>;
      getSavedShow(id: string): Promise<TVShow | undefined>;
      deleteSavedShow(id: string): Promise<void>;

      saveTorrent(torrent: Torrent): Promise<void>;
      getSavedTorrents(): Promise<[string, Torrent][]>;
      getSavedTorrent(hash: string): Promise<Torrent | undefined>;
      deleteSavedTorrent(hash: string): Promise<void>;
      getDH(hash: string): DownloadHistory;
      getAllDH(): Promise<Map<string, DownloadHistory>>;
      setDH(hash: string, d: DownloadHistory);
      deleteDH(hash: string);
      getDHPath(): Promise<string>;
      changeDHDir: (newDir: string) => void;
    };
  }
}
