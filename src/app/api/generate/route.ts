import { NextResponse } from 'next/server';

export const maxDuration = 60; // Set maximum execution time just in case

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemInstruction = 'You are a React component generator. When given a UI description, respond ONLY with a single valid React functional component written in JSX. Use Tailwind CSS for all styling. Do not include any explanation, markdown, imports, or code fences. Start directly with the function keyword or const keyword. The component must be self-contained and exportable as default.';
    
    // Append the user's prompt to the system instruction
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
           temperature: 0.2,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Extract text from the Gemini response structure
    const code = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!code) {
      throw new Error('Received empty response from Gemini');
    }

    return NextResponse.json({ code });
  } catch (error: any) {
    console.error('Error in generate API route:', error);
    return NextResponse.json({ error: 'Failed to generate code', details: error?.message || String(error) }, { status: 500 });
  }
}
