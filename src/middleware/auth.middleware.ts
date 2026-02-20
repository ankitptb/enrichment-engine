import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function apiAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-api-key"];

  if (!token || token !== env.apiAccessToken) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
}