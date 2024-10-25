import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { googleRouter } from "./Auth/googleAuth";
// import { outlookRouter } from "./Auth/outlookAuth";

dotenv.config();

const app= express();
const corsOptions: cors.CorsOptions = {
  origin: [],
  methods: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/", googleRouter);
// app.use("/", outlookRouter);

app.get("/", (req, res) => {
  res.send(`
        Welcome to the Demo!<br>`);
});
const port = process.env.PORT ? Number(process.env.PORT) : 3000; // Fallback to 3000 if not defined
if (isNaN(port) || port < 0 || port >= 65536) {
  console.error('Invalid port. Please set a port number between 0 and 65535.');
  process.exit(1); // Exit if the port is invalid
}


app.listen(8080, () => {
  console.log(`Server running on port 3000, http://localhost:3000`);
});

