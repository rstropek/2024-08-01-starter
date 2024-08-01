import express from "express";
import logger from "./logging.js";
import cors from "cors";
import sse from "./server-sent-events.js";

const app = express();

// Add the following lines to log all incoming requests
// import pinoHTTP from "pino-http";
// app.use(pinoHTTP.default({ logger }));

app.use(cors());
app.use(express.static("public"));

app.use("/sse", sse);

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  logger.info({ PORT }, "Listening");
});
