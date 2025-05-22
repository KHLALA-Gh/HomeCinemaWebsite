interface MovieMetaData {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
  runtime: string;
}

interface torrent {
  url: string;
  quality: string;
  type: string;
  video_codec: string;
  size: string;
  hash: string;
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
  description: string;
  yt_trailer_code: string;
  language: "en";
  background_image: string;
  torrents: torrent[];
}
