import express from "express";

const app = express();
const PORT = 5000;

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy server" });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
