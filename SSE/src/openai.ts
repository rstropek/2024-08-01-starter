import OpenAI from 'openai';
import dotenv from 'dotenv';
import express, { Router } from 'express';
import './openai-helpers.js';
import { Assistant } from 'openai/resources/beta/assistants.mjs';

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

