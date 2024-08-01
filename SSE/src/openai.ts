import OpenAI from 'openai';
import dotenv from 'dotenv';
import express, { Router } from 'express';
import './openai-helpers.js';
import { Assistant } from 'openai/resources/beta/assistants.mjs';
import { TextDeltaBlock } from 'openai/resources/beta/threads/messages.mjs';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createOrUpdateAssistant(): Promise<Assistant> {
  return await openai.beta.assistants.createOrUpdate({
    model: process.env.OPENAI_MODEL!,
    name: "Cat Training Assistant",
    description: "You are a helpful assistant helping with cat training.",
    instructions: "Help the user train their cat to do tricks and behave properly. Keep your answers funny and engaging.",
  });
}

export function route(assistant: Assistant) {
  const router = Router();

  router.get('/train-cat', async (_, response) => {
    response.writeHead(200, { 'Content-Type': 'text/event-stream' });

    const thread = await openai.beta.threads.create({
      messages: [
        { role: 'user', content: 'How can I make my cat do what I want?' },
      ]
    });

    const stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      stream: true,
    });
    for await (const event of stream) {
      if (event.event === "thread.message.delta") {
        response.write(`data: ${JSON.stringify((event.data.delta.content![0] as TextDeltaBlock).text?.value)}\n\n`);
      }
    }

    response.write("data\n\n");
    response.end();
  });

  return router;
}
