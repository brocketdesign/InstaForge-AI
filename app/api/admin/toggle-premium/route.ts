import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { updateSubscriptionTier, getOrCreateSubscription } from '@/lib/subscription';

// Admin user IDs that can toggle premium (add your Clerk user IDs here)
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];

export async function POST(request: Request) {
  try {
    const { userId } = await clerkAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = ADMIN_USER_IDS.includes(userId) || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { targetUserId, tier } = await request.json();
    const targetId = targetUserId || userId;

    if (!['free', 'pro'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Get current subscription to check current state
    const currentSub = await getOrCreateSubscription(targetId);

    // Toggle to the opposite tier if no specific tier is provided
    const newTier = tier || (currentSub.tier === 'pro' ? 'free' : 'pro');

    await updateSubscriptionTier(targetId, newTier, {
      interval: newTier === 'pro' ? 'monthly' : undefined,
      currentPeriodEnd: newTier === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
    });

    const updatedSub = await getOrCreateSubscription(targetId);

    return NextResponse.json({
      success: true,
      subscription: {
        tier: updatedSub.tier,
        interval: updatedSub.interval,
      },
    });
  } catch (error) {
    console.error('Error toggling premium:', error);
    return NextResponse.json(
      { error: 'Failed to toggle premium' },
      { status: 500 }
    );
  }
}
