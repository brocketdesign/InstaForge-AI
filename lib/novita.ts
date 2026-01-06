import axios from 'axios';

const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
const FLUX_API_URL = 'https://api.novita.ai/v3beta/flux-1-schnell';

interface FluxImageResponse {
  image_url: string;
}

interface FluxResponse {
  task: {
    task_id: string;
  };
  images: FluxImageResponse[];
}

export async function generateImages(prompt: string, count: number = 4): Promise<string[]> {
  try {
    if (!NOVITA_API_KEY) {
      // Return placeholder images for demo purposes
      return Array(count).fill(null).map((_, i) => 
        `https://picsum.photos/seed/${Date.now()}_${i}/1080/1080`
      );
    }

    // Use FLUX API for image generation
    const fluxPrompt = `best quality, ultra high res, (photorealistic:1.4), masterpiece, ${prompt}`;
    
    // Generate images in parallel (FLUX generates one image per request)
    const imagePromises = Array(count).fill(null).map(async () => {
      const response = await axios.post<FluxResponse>(
        FLUX_API_URL,
        {
          prompt: fluxPrompt,
          width: 1024,
          height: 1024,
          steps: 4,
          seed: Math.floor(Math.random() * 2147483647),
          image_num: 1,
          response_image_type: 'jpeg',
        },
        {
          headers: {
            'Authorization': `Bearer ${NOVITA_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // FLUX returns images immediately (no polling needed)
      if (response.data.images && response.data.images.length > 0) {
        return response.data.images[0].image_url;
      }
      return null;
    });

    const results = await Promise.all(imagePromises);
    const validImages = results.filter((url): url is string => url !== null);

    if (validImages.length === 0) {
      throw new Error('No images generated');
    }

    return validImages;
  } catch (error) {
    console.error('Error generating images:', error);
    // Fallback to placeholder images
    return Array(count).fill(null).map((_, i) => 
      `https://picsum.photos/seed/${Date.now()}_${i}/1080/1080`
    );
  }
}

export async function generateTextContent(prompt: string, theme: string, marketingGoal: string) {
  const placeholderContent = {
    textOverlays: [
      'Make It Happen',
      'Dream Big',
      'Stay Focused',
      'Keep Going'
    ],
    captions: [
      `${theme} is here! ${marketingGoal}. Check out our latest features.`,
      `Discover the power of ${theme}. Perfect for ${marketingGoal}.`,
      `Transform your workflow with ${theme}. Built for ${marketingGoal}.`,
      `Experience ${theme} like never before. Designed for ${marketingGoal}.`
    ],
    hashtags: [
      '#innovation',
      '#technology',
      '#growth',
      '#success',
      '#motivation',
      '#inspiration',
      '#business',
      '#entrepreneur',
      '#startup',
      '#digital'
    ]
  };

  try {
    if (!NOVITA_API_KEY) {
      // Return placeholder content for demo purposes
      return placeholderContent;
    }

    // Use Novita's LLM API for text generation
    const response = await axios.post(
      'https://api.novita.ai/v3/openai/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a creative Instagram content writer. Generate viral text overlays, engaging captions, and relevant hashtags. Always respond with valid JSON only, no markdown or code blocks.'
          },
          {
            role: 'user',
            content: `Generate Instagram content for: ${prompt}. Theme: ${theme}. Marketing Goal: ${marketingGoal}. 
            
            Provide:
            1. 4 short viral text overlays (max 3 words each)
            2. 4 engaging captions (50-100 characters each)
            3. 10 relevant hashtags
            
            Respond ONLY with JSON in this exact format: { "textOverlays": [], "captions": [], "hashtags": [] }`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${NOVITA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      // Remove any potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      
      // Normalize the response to ensure all values are strings
      return {
        textOverlays: normalizeToStringArray(parsed.textOverlays || []),
        captions: normalizeToStringArray(parsed.captions || []),
        hashtags: normalizeToStringArray(parsed.hashtags || []),
      };
    } catch {
      console.error('Failed to parse LLM response as JSON, using placeholder');
      return placeholderContent;
    }
  } catch (error) {
    console.error('Error generating text content:', error);
    // Fallback to placeholder content
    return placeholderContent;
  }
}

// Helper function to normalize array items to strings
// Handles cases where LLM returns objects like {text: "..."} instead of plain strings
function normalizeToStringArray(arr: unknown[]): string[] {
  return arr.map(item => {
    if (typeof item === 'string') {
      return item;
    }
    if (item && typeof item === 'object') {
      // Handle {text: "..."} format
      const obj = item as Record<string, unknown>;
      if ('text' in obj && typeof obj.text === 'string') {
        return obj.text;
      }
      // Handle {value: "..."} or similar formats
      const firstStringValue = Object.values(obj).find(v => typeof v === 'string');
      if (typeof firstStringValue === 'string') {
        return firstStringValue;
      }
    }
    return String(item);
  });
}
