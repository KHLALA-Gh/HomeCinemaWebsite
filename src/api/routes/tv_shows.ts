import { Router } from "express";
import { TMDBApi, TMDBError } from "../../lib/tmdb_api";

export const router = Router();

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
