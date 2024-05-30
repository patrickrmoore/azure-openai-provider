import { streamText } from 'ai';
import { gpt4 } from '../../azure-openai-instance';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: gpt4,
    messages,
  });

  return result.toAIStreamResponse();
}
