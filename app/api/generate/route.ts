import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { generateImages, generateTextContent } from '@/lib/novita';
import clientPromise from '@/lib/mongodb';
import { ContentItem, ImageContent, canGenerate, FREE_TIER_LIMIT } from '@/lib/types';
import { getOrCreateSubscription, incrementGenerationCount } from '@/lib/subscription';

export async function POST(request: Request) {
  try {
    const { userId } = await clerkAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription and generation limits
    const subscription = await getOrCreateSubscription(userId);
    
    if (!canGenerate(subscription)) {
      return NextResponse.json(
        { 
          error: 'Generation limit reached',
          message: `You've used all ${FREE_TIER_LIMIT} free generations this month. Upgrade to Pro for unlimited generations!`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { prompt, theme, marketingGoal, imageCount = 4 } = body;

    if (!prompt || !theme || !marketingGoal) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, theme, or marketingGoal' },
        { status: 400 }
      );
    }

    // Generate images
    const imageUrls = await generateImages(prompt, imageCount);

    // Generate text content
    const textContent = await generateTextContent(prompt, theme, marketingGoal);

    // Combine images with text overlays
    const images: ImageContent[] = imageUrls.map((url, index) => ({
      url,
      textOverlay: textContent.textOverlays[index] || '',
      position: 'center' as const,
    }));

    // Save to database
    const client = await clientPromise;
    const db = client.db('instaforge');
    
    const contentItem: ContentItem = {
      userId,
      prompt,
      images,
      captions: textContent.captions,
      hashtags: textContent.hashtags,
      theme,
      marketingGoal,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('content').insertOne(contentItem);

    // Increment generation count
    await incrementGenerationCount(userId);

    return NextResponse.json({
      success: true,
      contentId: result.insertedId,
      data: {
        ...contentItem,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
