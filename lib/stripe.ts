import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    generationsPerMonth: 10,
    features: [
      '10 image generations per month',
      'Basic AI models',
      'Standard resolution (512x512)',
      'Community support',
    ],
  },
  pro_monthly: {
    name: 'Pro Monthly',
    description: 'For serious creators',
    price: 19.99,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    generationsPerMonth: -1, // unlimited
    features: [
      'Unlimited image generations',
      'Premium AI models',
      'High resolution (1024x1024)',
      'Priority processing',
      'Advanced editing tools',
      'Priority support',
      'No watermarks',
    ],
  },
  pro_yearly: {
    name: 'Pro Yearly',
    description: 'Best value - save 33%',
    price: 159.99, // $13.33/month
    monthlyEquivalent: 13.33,
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    generationsPerMonth: -1, // unlimited
    features: [
      'Unlimited image generations',
      'Premium AI models',
      'High resolution (1024x1024)',
      'Priority processing',
      'Advanced editing tools',
      'Priority support',
      'No watermarks',
      '2 months free',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
