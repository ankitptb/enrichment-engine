import express from "express";
import cors from "cors";
import { env } from "./config/env";
import enrichRouter from "./routes/enrich.route";
import { apiAuth } from "../src/middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/enrich", apiAuth, enrichRouter);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
