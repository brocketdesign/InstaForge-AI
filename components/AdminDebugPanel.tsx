'use client';

import { useState, useEffect } from 'react';
import { 
  Bug, 
  X, 
  Crown, 
  RefreshCw, 
  User, 
  Zap,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react';

interface SubscriptionInfo {
  tier: string;
  interval?: string;
  generationsUsedThisMonth: number;
  generationsRemaining: number | 'unlimited';
}

export default function AdminDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Only show in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isOpen && !subscription) {
      fetchSubscription();
    }
  }, [isOpen]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      if (data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (tier: 'free' | 'pro') => {
    setActionLoading('toggle');
    try {
      const res = await fetch('/api/admin/toggle-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchSubscription();
        // Refresh the page to reflect changes
        window.location.reload();
      } else {
        alert(data.error || 'Failed to toggle premium');
      }
    } catch (error) {
      console.error('Failed to toggle premium:', error);
      alert('Failed to toggle premium');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50"
          title="Admin Debug Panel"
        >
          <Bug className="w-6 h-6" />
        </button>
      )}

      {/* Debug Panel */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 bg-gray-900 text-white rounded-xl shadow-2xl z-50 overflow-hidden transition-all ${
            isMinimized ? 'w-72' : 'w-80'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              <span className="font-semibold">Admin Debug</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="p-4 space-y-4">
              {/* Subscription Status */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Plan</span>
                  <button
                    onClick={fetchSubscription}
                    disabled={loading}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </div>
                ) : subscription ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {subscription.tier === 'pro' ? (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-semibold capitalize">
                        {subscription.tier}
                        {subscription.interval && ` (${subscription.interval})`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Generations used: {subscription.generationsUsedThisMonth}
                    </div>
                    <div className="text-sm text-gray-400">
                      Remaining: {subscription.generationsRemaining === 'unlimited' 
                        ? '∞ Unlimited' 
                        : subscription.generationsRemaining}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Click refresh to load</span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <span className="text-sm text-gray-400">Quick Actions</span>
                
                <button
                  onClick={() => togglePremium('pro')}
                  disabled={actionLoading === 'toggle' || subscription?.tier === 'pro'}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                    subscription?.tier === 'pro'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  }`}
                >
                  {actionLoading === 'toggle' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Crown className="w-4 h-4" />
                  )}
                  {subscription?.tier === 'pro' ? 'Already Pro' : 'Activate Pro'}
                </button>

                <button
                  onClick={() => togglePremium('free')}
                  disabled={actionLoading === 'toggle' || subscription?.tier === 'free'}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                    subscription?.tier === 'free'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {actionLoading === 'toggle' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {subscription?.tier === 'free' ? 'Already Free' : 'Downgrade to Free'}
                </button>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
                <Zap className="w-3 h-3 inline mr-1" />
                Development mode only
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
