import { createAzureOpenAI } from 'azure-openai-provider';

const azureOpenAI = createAzureOpenAI({
  apiVersion: '2024-02-01',
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
});

export const gpt4 = azureOpenAI('gpt-4-1106-preview', 'gpt-4-1106');
