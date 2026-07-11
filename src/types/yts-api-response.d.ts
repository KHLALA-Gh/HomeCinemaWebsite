interface MovieMetaData {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

interface Torrent {
  url: string;
  quality: string;
  type: string;
  video_codec: string;
  size: string;
  hash: string;
  seeds: number;
}

interface MovieDetails {
  id: number;
  title: string;
  year: number;
  url: string;
  rating: number;
  medium_cover_image: string;
  runtime: number;
  genres: string[];
  description_intro: string;
  yt_trailer_code: string;
  language: "en";
  background_image: string;
  torrents: Torrent[];
}
