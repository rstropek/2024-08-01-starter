import express from "express";
import logger from "./logging.js";

const router = express.Router();

router.get("/data-only", async (_, response) => {
  logger.info("Received SSE event");

  response.writeHead(200, { "Content-Type": "text/event-stream" });

  response.write("; Comment to keep connection open\n\n");

  for (let i = 0; i < 5; i++) {
    logger.info(`Sending chunk ${i}`);
    await sleep(1000);

    response.write(`data: ${i}\n\n`);
  }

  response.write("data: \n\n");

  logger.info("Streaming complete");
  response.end();
});

router.get("/custom-events", async (_, response) => {
  logger.info("Received SSE event");

  response.writeHead(200, { "Content-Type": "text/event-stream" });

  for (let i = 0; i < 5; i++) {
    logger.info(`Sending chunk ${i}`);
    await sleep(1000);

    response.write(`event: ${i % 2 === 0 ? "even" : "odd"}\n`);
    response.write(`data: { "value": ${i} }\n\n`);
  }

  response.write("event: eom\ndata\n\n");

  logger.info("Streaming complete");
  response.end();
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default router;
