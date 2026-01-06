import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  Image, 
  Sparkles, 
  Settings, 
  Shield, 
  Zap,
  Crown,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { getUserStats } from '@/lib/subscription';
import { getRemainingGenerations, FREE_TIER_LIMIT } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/');
  }

  const stats = await getUserStats(userId);
  const remaining = getRemainingGenerations(stats.subscription);
  const isPro = stats.subscription.tier === 'pro';
  
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }) 
    : 'N/A';

  return (
    <div className="space-y-8">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm p-1 ring-4 ring-white/30">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-purple-700 flex items-center justify-center">
              <span className="sr-only">Online</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName || ''}
              </h1>
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-200 border border-yellow-400/30 w-fit mx-auto md:mx-0">
                  <Crown className="w-3 h-3" />
                  Pro Creator
                </span>
              ) : (
                <Link 
                  href="/upgrade"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 w-fit mx-auto md:mx-0 hover:bg-white/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Free Plan
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 text-purple-100">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
              </span>
              <span className="hidden sm:block text-purple-300">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member since {memberSince}
              </span>
            </div>

            <p className="mt-4 text-purple-200 max-w-xl">
              Creating amazing AI-generated content with InstaForge. Let your imagination run wild! ✨
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="w-24 h-24" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              <p className="text-sm text-gray-500">Images Created</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {remaining === 'unlimited' ? '∞' : remaining}
              </p>
              <p className="text-sm text-gray-500">
                {isPro ? 'Unlimited Generations' : `of ${FREE_TIER_LIMIT} Left This Month`}
              </p>
            </div>
          </div>
          {!isPro && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${((remaining as number) / FREE_TIER_LIMIT) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContents}</p>
              <p className="text-sm text-gray-500">Content Sets</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isPro ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <Star className={`w-6 h-6 ${isPro ? 'text-yellow-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{isPro ? 'Pro' : 'Free'}</p>
              <p className="text-sm text-gray-500">Account Tier</p>
            </div>
          </div>
          {!isPro && (
            <Link 
              href="/upgrade"
              className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              Upgrade to Pro <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <a 
            href="/generate" 
            className="p-6 hover:bg-purple-50 transition-colors group flex items-center gap-4"
          >
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate New Image</p>
              <p className="text-sm text-gray-500">Create AI-powered content</p>
            </div>
          </a>
          
          <a 
            href="/gallery" 
            className="p-6 hover:bg-blue-50 transition-colors group flex items-center gap-4"
          >
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Gallery</p>
              <p className="text-sm text-gray-500">Browse your creations</p>
            </div>
          </a>
          
          <a 
            href="/dashboard" 
            className="p-6 hover:bg-green-50 transition-colors group flex items-center gap-4"
          >
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Dashboard</p>
              <p className="text-sm text-gray-500">View analytics & stats</p>
            </div>
          </a>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Account Settings
          </h2>
          <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            Secured by Clerk
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* Profile Info */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Information</p>
                <p className="text-sm text-gray-500">{user?.firstName} {user?.lastName || ''}</p>
              </div>
            </div>
            <a 
              href="/user-profile" 
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </a>
          </div>

          {/* Email */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Address</p>
                <p className="text-sm text-gray-500">{user?.emailAddresses?.[0]?.emailAddress || 'No email'}</p>
              </div>
            </div>
            <a 
              href="/user-profile" 
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Manage
            </a>
          </div>

          {/* Security */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security</p>
                <p className="text-sm text-gray-500">Password & two-factor authentication</p>
              </div>
            </div>
            <a 
              href="/user-profile/security" 
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Manage
            </a>
          </div>

          {/* Subscription */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isPro ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <Crown className={`w-5 h-5 ${isPro ? 'text-yellow-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Subscription</p>
                <p className="text-sm text-gray-500">
                  {isPro ? 'Pro Plan - Unlimited generations' : `Free Plan - ${remaining} generations left`}
                </p>
              </div>
            </div>
            <Link 
              href={isPro ? '/profile' : '/upgrade'}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isPro 
                  ? 'text-gray-600 hover:text-gray-700 hover:bg-gray-100' 
                  : 'text-white bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isPro ? 'Active' : 'Upgrade'}
            </Link>
          </div>

          {/* Member Since */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-500">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-6 text-sm text-gray-500">
        <p>Need help? Contact support at <a href="mailto:support@instaforge.ai" className="text-purple-600 hover:underline">support@instaforge.ai</a></p>
      </div>
    </div>
  );
}
