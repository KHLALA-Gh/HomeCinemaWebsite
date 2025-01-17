import { Router } from "express";
import data from "../../../home_cinema_config.json" with {type : "json"};

export const router = Router();

router.get("/api/config", (_, res) => {
  res.status(200).json(data);
});
