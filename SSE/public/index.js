
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"

const baseUrl = "http://localhost:3000";

const sseDataOnly = document.querySelector("#sse-data-only");
const sseDataOnlySpinner = document.querySelector("#sse-data-only-spinner");
const sseDataOnlyOutput = document.querySelector("#sse-data-only-output");

const sseCustomEvents = document.querySelector("#sse-custom-events");
const sseCustomEventsSpinner = document.querySelector("#sse-custom-events-spinner");
const sseCustomEventsOutput = document.querySelector("#sse-custom-events-output");

const openai = document.querySelector("#openai");
const openaiOutput = document.querySelector("#openai-output");

sseDataOnly.addEventListener("click", async () => {
  sseDataOnlySpinner.style.display = "block";
  sseDataOnlyOutput.innerHTML = "";

  const eventSource = new EventSource(`${baseUrl}/sse/data-only`);
  eventSource.onmessage = (event) => {
    if (!event.data) {
      eventSource.close();
      sseDataOnlySpinner.style.display = "";
      return;
    }

    sseDataOnlyOutput.innerHTML += `${event.data}\n`;
  };

});

sseCustomEvents.addEventListener("click", async () => {
  sseCustomEventsSpinner.style.display = "block";
  sseCustomEventsOutput.innerHTML = "";

  const eventSource = new EventSource(`${baseUrl}/sse/custom-events`);

  eventSource.addEventListener("even", event => {
    sseCustomEventsOutput.innerHTML += `EVEN: ${JSON.parse(event.data).value}\n`;
  });

  eventSource.addEventListener("odd", event => {
    sseCustomEventsOutput.innerHTML += `ODD: ${JSON.parse(event.data).value}\n`;
  });

  eventSource.addEventListener("eom", () => {
    eventSource.close();
    sseCustomEventsSpinner.style.display = "";
  });
});

openai.addEventListener("click", async () => {
  let markdown = "";
  openaiOutput.innerHTML = "";
  openaiOutput.style.display = "block";

});
