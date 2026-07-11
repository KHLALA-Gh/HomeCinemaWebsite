import { Router } from "express";

export const router = Router();
export function getConfigs(router: Router, config: ServerConfig) {
  router.get("/api/config", (_, res) => {
    res.status(200).json(config);
  });
}
