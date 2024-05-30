import { createAzureOpenAI } from "azure-openai-provider";
import { StreamData, StreamingTextResponse, streamText } from "ai";

const azureOpenAI = createAzureOpenAI({
  apiVersion: "2024-02-01",
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: azureOpenAI(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      "gpt-4-1106-preview"
    ),
    messages,
  });

  const data = new StreamData();

  data.append({ test: "value" });

  const stream = result.toAIStream({
    onFinal() {
      data.close();
    },
  });

  return new StreamingTextResponse(stream, {}, data);
}
