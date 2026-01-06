import { ObjectId } from 'mongodb';

export interface ImageContent {
  url: string;
  textOverlay?: string;
  position?: 'top' | 'center' | 'bottom';
}

export interface ContentItem {
  _id?: ObjectId;
  userId: string;
  prompt: string;
  images: ImageContent[];
  captions: string[];
  hashtags: string[];
  theme: string;
  marketingGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  _id?: ObjectId;
  userId: string;
  defaultTheme?: string;
  defaultMarketingGoal?: string;
  favoriteHashtags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionInterval = 'monthly' | 'yearly';

export interface UserSubscription {
  _id?: ObjectId;
  clerkUserId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  tier: SubscriptionTier;
  interval?: SubscriptionInterval;
  generationsUsedThisMonth: number;
  generationsResetDate: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const FREE_TIER_LIMIT = 10;

export function getGenerationsLimit(tier: SubscriptionTier): number {
  return tier === 'pro' ? -1 : FREE_TIER_LIMIT; // -1 means unlimited
}

export function canGenerate(subscription: UserSubscription): boolean {
  if (subscription.tier === 'pro') return true;
  return subscription.generationsUsedThisMonth < FREE_TIER_LIMIT;
}

export function getRemainingGenerations(subscription: UserSubscription): number | 'unlimited' {
  if (subscription.tier === 'pro') return 'unlimited';
  return Math.max(0, FREE_TIER_LIMIT - subscription.generationsUsedThisMonth);
}

