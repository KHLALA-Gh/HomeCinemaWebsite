interface TMDBTVShow {
  id: number;
  name: string;
  vote_average: number;
  backdrop_path: string;
  genre_ids: number[];
  origin_country: string[];
  poster_path: string;
  first_air_date: string;
}

interface SeasonDetails {
  episodes: Episode;
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
  air_date: string;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface TMDBTVShowDetails {
  id: number;
  name: string;
  vote_average: number;
  backdrop_path: string;
  genres: Genre[];
  origin_country: string[];
  poster_path: string;
  first_air_date: string;
  seasons: Season[];
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface TVShowsResp {
  page: number;
  results: TMDBTVShow[];
  total_pages: number;
}
