import { generateObject } from 'ai';
import { z } from 'zod';
import { gpt4 } from '../../azure-openai-instance';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name');

  const { object } = await generateObject({
    model: gpt4,
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt: `Generate a ${name ?? 'lasagna'} recipe.`,
  });

  return NextResponse.json(object);
}
