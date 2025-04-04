import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const art = await hf.textToImage({
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
    inputs: `${prompt}, crypto coin artwork, vibrant, trending`,
  });

  return new Response(art, {
    headers: { 'Content-Type': 'image/png' }
  });
}