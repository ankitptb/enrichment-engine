import { Router } from "express";
import { enrichController } from "../controllers/enrich.controller";

const router = Router();

router.post("/", enrichController);

export default router;
