import axios from 'axios';

const NOVITA_API_URL = process.env.NOVITA_API_URL || 'https://api.novita.ai/v3';
const NOVITA_API_KEY = process.env.NOVITA_API_KEY;

export async function generateImages(prompt: string, count: number = 4): Promise<string[]> {
  try {
    if (!NOVITA_API_KEY) {
      // Return placeholder images for demo purposes
      return Array(count).fill(null).map((_, i) => 
        `https://picsum.photos/seed/${Date.now()}_${i}/1080/1080`
      );
    }

    const response = await axios.post(
      `${NOVITA_API_URL}/txt2img`,
      {
        prompt,
        model_name: 'sd_xl_base_1.0.safetensors',
        width: 1080,
        height: 1080,
        steps: 30,
        batch_size: count,
        cfg_scale: 7,
      },
      {
        headers: {
          'Authorization': `Bearer ${NOVITA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.images || [];
  } catch (error) {
    console.error('Error generating images:', error);
    // Fallback to placeholder images
    return Array(count).fill(null).map((_, i) => 
      `https://picsum.photos/seed/${Date.now()}_${i}/1080/1080`
    );
  }
}

export async function generateTextContent(prompt: string, theme: string, marketingGoal: string) {
  try {
    if (!NOVITA_API_KEY) {
      // Return placeholder content for demo purposes
      return {
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
    }

    const response = await axios.post(
      `${NOVITA_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative Instagram content writer. Generate viral text overlays, engaging captions, and relevant hashtags.'
          },
          {
            role: 'user',
            content: `Generate Instagram content for: ${prompt}. Theme: ${theme}. Marketing Goal: ${marketingGoal}. 
            
            Provide:
            1. 4 short viral text overlays (max 3 words each)
            2. 4 engaging captions (50-100 characters each)
            3. 10 relevant hashtags
            
            Format as JSON: { "textOverlays": [], "captions": [], "hashtags": [] }`
          }
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${NOVITA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = JSON.parse(response.data.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error generating text content:', error);
    // Fallback to placeholder content
    return {
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
  }
}
