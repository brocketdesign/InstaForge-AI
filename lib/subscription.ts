import clientPromise from '@/lib/mongodb';
import { UserSubscription, SubscriptionTier } from '@/lib/types';

export async function getOrCreateSubscription(clerkUserId: string): Promise<UserSubscription> {
  const client = await clientPromise;
  const db = client.db('instaforge');
  const subscriptions = db.collection<UserSubscription>('subscriptions');

  let subscription = await subscriptions.findOne({ clerkUserId });

  if (!subscription) {
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // First of next month

    const newSubscription: UserSubscription = {
      clerkUserId,
      tier: 'free',
      generationsUsedThisMonth: 0,
      generationsResetDate: resetDate,
      createdAt: now,
      updatedAt: now,
    };

    const result = await subscriptions.insertOne(newSubscription);
    return { ...newSubscription, _id: result.insertedId };
  }

  // Check if we need to reset monthly generations
  const now = new Date();
  if (now >= subscription.generationsResetDate) {
    const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    await subscriptions.updateOne(
      { clerkUserId },
      {
        $set: {
          generationsUsedThisMonth: 0,
          generationsResetDate: nextResetDate,
          updatedAt: now,
        },
      }
    );
    subscription.generationsUsedThisMonth = 0;
    subscription.generationsResetDate = nextResetDate;
  }

  return subscription as UserSubscription;
}

export async function incrementGenerationCount(clerkUserId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db('instaforge');
  const subscriptions = db.collection<UserSubscription>('subscriptions');

  await subscriptions.updateOne(
    { clerkUserId },
    {
      $inc: { generationsUsedThisMonth: 1 },
      $set: { updatedAt: new Date() },
    }
  );
}

export async function updateSubscriptionTier(
  clerkUserId: string,
  tier: SubscriptionTier,
  stripeData?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    interval?: 'monthly' | 'yearly';
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }
): Promise<void> {
  const client = await clientPromise;
  const db = client.db('instaforge');
  const subscriptions = db.collection<UserSubscription>('subscriptions');

  await subscriptions.updateOne(
    { clerkUserId },
    {
      $set: {
        tier,
        ...stripeData,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function getUserStats(clerkUserId: string) {
  const client = await clientPromise;
  const db = client.db('instaforge');

  const [totalContents, subscription] = await Promise.all([
    db.collection('content').countDocuments({ userId: clerkUserId }),
    getOrCreateSubscription(clerkUserId),
  ]);

  // Count total images (each content can have multiple images)
  const contentWithImages = await db
    .collection('content')
    .find({ userId: clerkUserId })
    .toArray();

  const totalImages = contentWithImages.reduce(
    (acc, content) => acc + (content.images?.length || 0),
    0
  );

  return {
    totalContents,
    totalImages,
    subscription,
  };
}
