import { NextResponse } from 'next/server';

export async function POST(request) {
  const { prompt } = await request.json();
  
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  
  const imageBuffer = await response.arrayBuffer();
  return new NextResponse(Buffer.from(imageBuffer), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}