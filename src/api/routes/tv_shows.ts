import { Response, Router } from "express";
import { TMDBApi, TMDBError } from "../../lib/tmdb_api";

export const router = Router();

function HandlerTMDBApiErr(res: Response, err: TMDBError) {
  console.log(TMDBError.format(err));
  res.status(err.statusCode).json({
    error: err.message,
  });
  return;
}

router.get("/api/tv_shows", async (req, res) => {
  try {
    const tmApi = new TMDBApi(process.env.TMDB_KEY as string);
    let page = req.query.page;
    if (page && isNaN(+page)) {
      page = "1";
    }
    const data = await tmApi.getTVShows(page as string);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof TMDBError) {
      res.status(err.statusCode).json({
        error: err.message,
      });
      console.log(TMDBError.format(err));
      return;
    }
    res.status(500).json({
      error: "internal server error",
    });
    console.log("error when getting TV SHOWS");
  }
});

router.get("/api/tv_shows/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const api = new TMDBApi(process.env.TMDB_KEY as string);
    const data = await api.getTVShowDetails(id);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof TMDBError) {
      console.log(TMDBError.format(err));
      res.status(err.statusCode).json({
        error: err.message,
      });
      return;
    }
    console.log("Internal Server Error !! : ", err);
    res.status(500).json({
      error: "internal server error",
    });
  }
});

router.get("/api/tv_shows/:id/season/:season_number", async (req, res) => {
  try {
    const id = req.params.id;
    const seasonNumber = req.params.season_number;
    const api = new TMDBApi(process.env.TMDB_KEY as string);
    const data = await api.getSeasonDetails(id, seasonNumber);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof TMDBError) {
      return HandlerTMDBApiErr(res, err);
    }
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
