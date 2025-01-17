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
interface TVShowsResp {
  page: number;
  results: TMDBTVShow[];
  total_pages: number;
}
