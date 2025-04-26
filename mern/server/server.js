import express from "express";
import cors from "cors";
import bins from "./routes/bin.js";
import { seedBinsIfEmpty } from "./db/binSeeder.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/bin", bins);

seedBinsIfEmpty();

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});