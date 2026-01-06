import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            InstaForge AI
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Create Instagram-ready visuals and captions from a simple prompt
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Generate multiple AI images from a single concept, overlay short viral text ideas for each image, 
            and produce optimized captions with hashtags aligned to your marketing goals.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">AI Image Generation</h3>
              <p className="text-gray-600">
                Generate multiple stunning AI images from a single prompt using Novita AI
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-bold mb-3">Viral Text Overlays</h3>
              <p className="text-gray-600">
                Add engaging text overlays to your images for maximum impact
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3">Smart Captions</h3>
              <p className="text-gray-600">
                Generate optimized captions with relevant hashtags for better reach
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
