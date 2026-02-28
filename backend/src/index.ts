import express from "express";
import { Env } from "./config/env";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy server" });
});

app.listen(Env.PORT, () =>
  console.log(`Server running at http://localhost:${Env.PORT}`),
);
