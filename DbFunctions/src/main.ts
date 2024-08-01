import OpenAI from 'openai';
import dotenv from 'dotenv';
import './openai-helpers.js';
import winston from 'winston';
import { FunctionToolCall } from 'openai/resources/beta/threads/runs/steps.mjs';
import { createConnectionPool } from './sql.js';
import { readLine } from './input.js';

dotenv.config({ path: '.env' });

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [new winston.transports.Console()],
});

logger.info('Creating connection pool');
const pool = await createConnectionPool(process.env.ADVENTURE_WORKS ?? '');
logger.info('Connection pool connected');

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

let assistant = await openai.beta.assistants.createOrUpdate({
    model: process.env.OPENAI_MODEL!, // process.env.OPENAI_AZURE_DEPLOYMENT ?? '',
    name: 'Demo',
    description: 'This is a demo assistant',
    instructions: `You are a helpful assistant`
}, logger);

const thread = await openai.beta.threads.create();
while (true) {
    let userMessage = await readLine('You (just press enter to exit the conversation): ');
    if (!userMessage) { break; }

    const run = await openai.beta.threads.addMessageAndRunToCompletion(assistant.id, thread.id, userMessage, logger, async (functionCall: FunctionToolCall.Function) => {});

    if (run.status === 'completed') {
        const lastMessage = await openai.beta.threads.getLatestMessage(thread.id);
        console.log(`\n🤖: ${lastMessage}`);
    }
}

pool.close();
