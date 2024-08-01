import OpenAI from 'openai';
import dotenv from 'dotenv';
import './openai-helpers.js';
import winston from 'winston';
import { FunctionToolCall } from 'openai/resources/beta/threads/runs/steps.mjs';
import { createConnectionPool } from './sql.js';
import { readLine } from './input.js';
import { getCustomerProductsRevenue, getCustomerProductsRevenueFunctionDefinition, getCustomers, getCustomersFunctionDefinition, getProducts, getProductsFunctionDefinition, WeatherFunctionDefinition } from './functions.js';

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
    name: 'Revenue Analyzer',
    description: 'Retrieves customer and product revenue and analyzes it using code interpreter',
    instructions: `You are an assistant supporting business users who need to analyze the revene of
customers and products. Use the provided function tools to access the order database
and answer the user's questions.

Only answer questions related to customer and product revenue. If the user asks
questions not related to this topic, tell her or him that you cannot
answer such questions.

If the user asks a question that cannot be answered with the provided function tools,
tell her or him that you cannot answer the question because of a lack of access
to the required data.`,
    tools: [
        //{ type: 'function', function: WeatherFunctionDefinition },
        { type: 'function', function: getCustomersFunctionDefinition },
        { type: 'function', function: getProductsFunctionDefinition },
        { type: 'function', function: getCustomerProductsRevenueFunctionDefinition },
        { type: 'code_interpreter' }
    ]
}, logger);

const thread = await openai.beta.threads.create();
while (true) {
    let userMessage = await readLine('You (just press enter to exit the conversation): ');
    if (!userMessage) { break; }

    const run = await openai.beta.threads.addMessageAndRunToCompletion(assistant.id, thread.id, userMessage, logger, async (functionCall: FunctionToolCall.Function) => {
        switch (functionCall.name) {
            case 'getCustomers':
                return await getCustomers(pool, JSON.parse(functionCall.arguments), logger);
            case 'getProducts':
                return await getProducts(pool, JSON.parse(functionCall.arguments), logger);
            case 'getCustomerProductsRevenue':
                return await getCustomerProductsRevenue(pool, JSON.parse(functionCall.arguments), logger);
            default:
                return new Error("Unknown function");
        }
    });

    if (run.status === 'completed') {
        const lastMessage = await openai.beta.threads.getLatestMessage(thread.id);
        console.log(`\n🤖: ${lastMessage}`);
    }
}

pool.close();
