'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    theme: '',
    marketingGoal: '',
    imageCount: 4,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      
      // Redirect to edit page with the generated content
      router.push(`/edit/${data.contentId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Generate Content
        </h1>
        <p className="text-gray-600 mt-2">
          Create Instagram-ready visuals and captions from your prompt
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Prompt *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the content you want to create... (e.g., 'A modern smartphone with futuristic features')"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            />
          </div>

          {/* Theme Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Technology, Fashion, Food, Travel"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />
          </div>

          {/* Marketing Goal Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marketing Goal *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., App Promotion, Product Launch, Brand Awareness"
              value={formData.marketingGoal}
              onChange={(e) => setFormData({ ...formData, marketingGoal: e.target.value })}
            />
          </div>

          {/* Image Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Images
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.imageCount}
              onChange={(e) => setFormData({ ...formData, imageCount: parseInt(e.target.value) })}
            >
              <option value={2}>2 Images</option>
              <option value={4}>4 Images</option>
              <option value={6}>6 Images</option>
              <option value={8}>8 Images</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 bg-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-3 text-purple-900">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-purple-800">
          <li>• Be specific in your prompt for more accurate results</li>
          <li>• Choose a theme that aligns with your brand</li>
          <li>• Define a clear marketing goal for targeted captions</li>
          <li>• Start with 4 images and adjust based on your needs</li>
        </ul>
      </div>
    </div>
  );
}
