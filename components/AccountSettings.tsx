'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Shield, 
  Crown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface AccountSettingsProps {
  isPro: boolean;
  remaining: number | 'unlimited';
  memberSince: string;
}

export default function AccountSettings({ isPro, remaining, memberSince }: AccountSettingsProps) {
  const { openUserProfile } = useClerk();
  const { user } = useUser();

  const handleOpenProfile = () => {
    openUserProfile();
  };

  const handleOpenSecurity = () => {
    openUserProfile({ customPages: [] });
  };

  return (
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
        <button 
          onClick={handleOpenProfile}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Profile Information</p>
              <p className="text-sm text-gray-500">{user?.firstName} {user?.lastName || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">Edit</span>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </div>
        </button>

        {/* Email */}
        <button 
          onClick={handleOpenProfile}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Address</p>
              <p className="text-sm text-gray-500">{user?.emailAddresses?.[0]?.emailAddress || 'No email'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">Manage</span>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </div>
        </button>

        {/* Security */}
        <button 
          onClick={handleOpenSecurity}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Security</p>
              <p className="text-sm text-gray-500">Password & two-factor authentication</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">Manage</span>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </div>
        </button>

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
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isPro 
                ? 'text-gray-600 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-white bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isPro ? 'Active' : 'Upgrade'}
            {!isPro && <ChevronRight className="w-4 h-4" />}
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
  );
}
