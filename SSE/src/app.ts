import express from "express";
import logger from "./logging.js";
import cors from "cors";

const app = express();

// Add the following lines to log all incoming requests
// import pinoHTTP from "pino-http";
// app.use(pinoHTTP.default({ logger }));

app.use(cors());
app.use(express.static("public"));

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  logger.info({ PORT }, "Listening");
});
