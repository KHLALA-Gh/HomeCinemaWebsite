import axios, { AxiosError } from "axios";

export enum TMDBErrorStatusCode {
  GET_TVSHOWS_ERR,
  BAD_REQUEST,
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
  static tvShowsendPoint = "https://api.themoviedb.org/3/discover/tv";
  private api_key: string;
  constructor(api_key: string) {
    this.api_key = api_key;
  }
  async getTVShows(page?: string): Promise<TVShowsResp> {
    const url = new URL(TMDBApi.tvShowsendPoint);
    url.searchParams.set("page", page || "1");
    try {
      const resp = await axios.get(url.href, {
        headers: {
          Authorization: `Bearer ${this.api_key}`,
        },
      });
      return resp.data as TVShowsResp;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status && e.status < 500) {
          throw new TMDBError(
            `Cannot get tv shows : ${e.response?.data.status_message}`,
            e.status,
            TMDBErrorStatusCode.BAD_REQUEST
          );
        }
        throw new TMDBError(
          `unable to get tv shows : ${e.message}`,
          e.status!,
          TMDBErrorStatusCode.GET_TVSHOWS_ERR
        );
      }
      throw e;
    }
  }
}
