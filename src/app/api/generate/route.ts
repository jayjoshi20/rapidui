import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = 'You are a React component generator. When given a UI description, respond ONLY with a single valid React functional component written in JSX. Use Tailwind CSS for all styling. Do not include any explanation, markdown, imports, or code fences. Start directly with the function keyword or const keyword. The component must be self-contained and exportable as default.';
    
    // Append the user's prompt to the system instruction
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(fullPrompt);
    const code = result.response.text();

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error in generate API route:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}
