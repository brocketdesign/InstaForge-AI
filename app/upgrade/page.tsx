'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Image,
  Clock,
  Headphones,
  X,
  Loader2,
} from 'lucide-react';

const PLANS = {
  free: {
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    features: [
      { text: '10 image generations per month', included: true },
      { text: 'Basic AI models', included: true },
      { text: 'Standard resolution (512x512)', included: true },
      { text: 'Community support', included: true },
      { text: 'Unlimited generations', included: false },
      { text: 'Premium AI models', included: false },
      { text: 'High resolution (1024x1024)', included: false },
      { text: 'Priority processing', included: false },
    ],
  },
  pro_monthly: {
    name: 'Pro',
    description: 'For serious creators',
    price: 19.99,
    monthlyEquivalent: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    interval: 'monthly' as const,
    features: [
      { text: 'Unlimited image generations', included: true },
      { text: 'Premium AI models', included: true },
      { text: 'High resolution (1024x1024)', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced editing tools', included: true },
      { text: 'Priority support', included: true },
      { text: 'No watermarks', included: true },
    ],
  },
  pro_yearly: {
    name: 'Pro',
    description: 'Best value - save 33%',
    price: 159.99,
    monthlyEquivalent: 13.33,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    interval: 'yearly' as const,
    features: [
      { text: 'Unlimited image generations', included: true },
      { text: 'Premium AI models', included: true },
      { text: 'High resolution (1024x1024)', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced editing tools', included: true },
      { text: 'Priority support', included: true },
      { text: 'No watermarks', included: true },
      { text: '2 months free', included: true },
    ],
  },
};

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [showCancelMessage, setShowCancelMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCancelMessage(true);
      setTimeout(() => setShowCancelMessage(false), 5000);
    }

    // Fetch current subscription
    fetch('/api/user/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription?.tier) {
          setCurrentTier(data.subscription.tier);
        }
      })
      .catch(console.error);
  }, [searchParams]);

  const handleUpgrade = async (planKey: 'pro_monthly' | 'pro_yearly') => {
    const plan = PLANS[planKey];
    if (!plan.priceId) {
      alert('Please configure Stripe price IDs in environment variables');
      return;
    }

    setLoading(planKey);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          interval: plan.interval,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading('manage');

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const selectedPlan = billingInterval === 'monthly' ? PLANS.pro_monthly : PLANS.pro_yearly;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Cancel Message */}
      {showCancelMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-yellow-800">
            Checkout was canceled. Feel free to try again when you're ready!
          </p>
          <button onClick={() => setShowCancelMessage(false)}>
            <X className="w-5 h-5 text-yellow-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Unlock Your Creative Potential
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get unlimited AI generations, premium features, and priority support with InstaForge Pro.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingInterval === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingInterval === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              Save 33%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Free</h3>
            <p className="text-gray-500 mt-1">Get started with basic features</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$0</span>
            <span className="text-gray-500">/month</span>
          </div>

          <button
            disabled={currentTier === 'free'}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              currentTier === 'free'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentTier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>

          <ul className="mt-8 space-y-4">
            {PLANS.free.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              POPULAR
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-purple-200 mt-1">{selectedPlan.description}</p>
          </div>

          <div className="mb-6">
            {billingInterval === 'yearly' ? (
              <>
                <span className="text-4xl font-bold">${selectedPlan.monthlyEquivalent}</span>
                <span className="text-purple-200">/month</span>
                <p className="text-purple-200 text-sm mt-1">
                  Billed annually (${selectedPlan.price}/year)
                </p>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold">${selectedPlan.price}</span>
                <span className="text-purple-200">/month</span>
              </>
            )}
          </div>

          {currentTier === 'pro' ? (
            <button
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="w-full py-3 bg-white text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading === 'manage' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Manage Subscription
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade(billingInterval === 'monthly' ? 'pro_monthly' : 'pro_yearly')}
              disabled={loading !== null}
              className="w-full py-3 bg-white text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Upgrade to Pro
                </>
              )}
            </button>
          )}

          <ul className="mt-8 space-y-4">
            {selectedPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>

          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why Go Pro?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Generations</h3>
            <p className="text-sm text-gray-500">Create as many images as you want, no monthly limits.</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Resolution</h3>
            <p className="text-sm text-gray-500">Get crisp 1024x1024 images perfect for any platform.</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Priority Processing</h3>
            <p className="text-sm text-gray-500">Skip the queue and get your images faster.</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
            <p className="text-sm text-gray-500">Get help fast with dedicated support access.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards through our secure Stripe payment processing.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely! All payments are processed securely through Stripe. We never store your card details.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens to my images if I downgrade?</h3>
            <p className="text-gray-600 text-sm">
              All your generated images stay in your gallery. You'll just be limited to the free tier's monthly generations.
            </p>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Secured by Stripe • Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
