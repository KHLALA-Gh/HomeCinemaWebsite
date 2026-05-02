import axios, { AxiosError } from "axios";

export enum TMDBErrorStatusCode {
  GET_TVSHOWS_ERR,
  BAD_REQUEST,
}

export interface ErrResp {
  status_message: string;
}

export class TMDBError extends Error {
  public code = 0;
  public statusCode;
  constructor(message: string, statusCode: number, code: TMDBErrorStatusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  static format(e: TMDBError) {
    return `[${new Date().toLocaleTimeString()}] STATUS CODE : ${
      e.statusCode
    } | ${e.message}`;
  }
}
export class TMDBApi {
  static trendingMoviesEndPoint =
    "https://api.themoviedb.org/3/trending/movie/";
  static movieDetailsEndPoint = "https://api.themoviedb.org/3/movie/:id";
  static tvShowsendPoint = "https://api.themoviedb.org/3/trending/tv/week";
  static externalTVIDsEndPoint =
    "https://api.themoviedb.org/3/tv/:id/external_ids";
  static externalMovieIDsEndPoint =
    "https://api.themoviedb.org/3/movie/:id/external_ids";
  static tvShowDetailsEndPoint = "https://api.themoviedb.org/3/tv/:id";
  static tvShowSeasonDetails =
    "https://api.themoviedb.org/3/tv/:series_id/season/:season_number";
  static tvShowsSearchEndPoint = "https://api.themoviedb.org/3/search/tv";
  static movieSearchEndPoint = "https://api.themoviedb.org/3/search/movie";
  private api_key: string;
  constructor(api_key: string) {
    this.api_key = api_key;
  }
  private authHeader() {
    return `Bearer ${this.api_key}`;
  }
  private handleAxiosErr(e: AxiosError) {
    if (e.status && e.status < 500) {
      throw new TMDBError(
        `${(e.response?.data as ErrResp).status_message} ${e.response?.config.url}`,
        e.status,
        TMDBErrorStatusCode.BAD_REQUEST,
      );
    }
    throw new TMDBError(
      `${e.message}`,
      e.status!,
      TMDBErrorStatusCode.GET_TVSHOWS_ERR,
    );
  }
  async getTVShows(page?: string): Promise<TVShowsResp> {
    const url = new URL(TMDBApi.tvShowsendPoint);
    url.searchParams.set("page", page || "1");
    try {
      const resp = await axios.get(url.href, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as TVShowsResp;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status && e.status < 500) {
          throw new TMDBError(
            `Cannot get tv shows : ${e.response?.data.status_message}`,
            e.status,
            TMDBErrorStatusCode.BAD_REQUEST,
          );
        }
        throw new TMDBError(
          `unable to get tv shows : ${e.message}`,
          e.status!,
          TMDBErrorStatusCode.GET_TVSHOWS_ERR,
        );
      }
      throw e;
    }
  }
  async getTVShowDetails(id: string): Promise<TMDBTVShowDetails> {
    const url = TMDBApi.tvShowDetailsEndPoint.replace(":id", id);

    try {
      const resp = await axios.get(url, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as TMDBTVShowDetails;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async getMovieDetails(id: string): Promise<TMDBMovieDetails> {
    const url = TMDBApi.movieDetailsEndPoint.replace(":id", id);

    try {
      const resp = await axios.get(url, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as TMDBMovieDetails;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async getSeasonDetails(
    series_id: string,
    season_number: string,
  ): Promise<SeasonDetails> {
    let url = TMDBApi.tvShowSeasonDetails.replace(":series_id", series_id);
    url = url.replace(":season_number", season_number);
    try {
      const resp = await axios.get(url, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as SeasonDetails;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async getMovieExternalIDs(id: string): Promise<MovieExternalIDs> {
    let url = TMDBApi.externalMovieIDsEndPoint.replace(":id", id);
    try {
      const resp = await axios.get(url, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      console.log(resp.data);
      return resp.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async getTVExternalIDs(id: string): Promise<MovieExternalIDs> {
    let url = TMDBApi.externalTVIDsEndPoint.replace(":id", id);
    try {
      const resp = await axios.get(url, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      console.log(resp.data);
      return resp.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async searchTvShows(query: string, page: string): Promise<TVShowsResp> {
    let url = new URL(TMDBApi.tvShowsSearchEndPoint);
    url.searchParams.set("query", query);
    url.searchParams.set("page", page);
    try {
      const resp = await axios.get(url.href, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as TVShowsResp;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }

  async searchMovies(query: string, page: string): Promise<MoviesResp> {
    let url = new URL(TMDBApi.movieSearchEndPoint);
    url.searchParams.set("query", query);
    url.searchParams.set("page", page);
    try {
      const resp = await axios.get(url.href, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as MoviesResp;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
  async trendingMovies(
    time: "day" | "week",
    page: string,
  ): Promise<MoviesResp> {
    let url = new URL(time, TMDBApi.trendingMoviesEndPoint);

    url.searchParams.set("page", page);
    console.log(url.href);
    try {
      const resp = await axios.get(url.href, {
        headers: {
          Authorization: this.authHeader(),
        },
      });
      return resp.data as MoviesResp;
    } catch (err) {
      if (err instanceof AxiosError) {
        this.handleAxiosErr(err);
      }
      throw err;
    }
  }
}
