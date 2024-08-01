
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

});

sseCustomEvents.addEventListener("click", async () => {
  sseCustomEventsSpinner.style.display = "block";
  sseCustomEventsOutput.innerHTML = "";

});

openai.addEventListener("click", async () => {
  let markdown = "";
  openaiOutput.innerHTML = "";
  openaiOutput.style.display = "block";

});
