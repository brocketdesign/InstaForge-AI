import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Image, Images, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to InstaForge AI! Generate Instagram-ready content with AI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate Content Card */}
        <Link href="/generate">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white hover:shadow-xl transition cursor-pointer">
            <Sparkles className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Generate Content</h2>
            <p className="text-purple-100">
              Create AI-generated images and captions from a simple prompt
            </p>
          </div>
        </Link>

        {/* Gallery Card */}
        <Link href="/gallery">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-gray-100">
            <Images className="w-12 h-12 mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Gallery</h2>
            <p className="text-gray-600">
              View and manage all your generated content
            </p>
          </div>
        </Link>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100">
          <TrendingUp className="w-12 h-12 mb-4 text-green-600" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Your Stats</h2>
          <p className="text-gray-600">
            Track your content generation performance
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-purple-600 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Enter Your Prompt</h3>
            <p className="text-gray-600">
              Describe the content you want to create with a simple text prompt
            </p>
          </div>
          <div>
            <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-pink-600 font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Generation</h3>
            <p className="text-gray-600">
              Our AI generates multiple images, text overlays, and captions
            </p>
          </div>
          <div>
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Edit & Share</h3>
            <p className="text-gray-600">
              Customize your content and download for Instagram
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
