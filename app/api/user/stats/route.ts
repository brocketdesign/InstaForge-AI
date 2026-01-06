import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserStats } from '@/lib/subscription';
import { getRemainingGenerations } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await clerkAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getUserStats(userId);
    const remaining = getRemainingGenerations(stats.subscription);

    return NextResponse.json({
      totalContents: stats.totalContents,
      totalImages: stats.totalImages,
      subscription: {
        tier: stats.subscription.tier,
        interval: stats.subscription.interval,
        generationsUsedThisMonth: stats.subscription.generationsUsedThisMonth,
        generationsRemaining: remaining,
        generationsResetDate: stats.subscription.generationsResetDate,
        currentPeriodEnd: stats.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: stats.subscription.cancelAtPeriodEnd,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
