import express from "express";
import cors from "cors";
import { env } from "./config/env";
import enrichRouter from "./routes/enrich.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/enrich", enrichRouter);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
