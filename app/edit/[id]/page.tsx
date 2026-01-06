'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Save, ArrowLeft, Download } from 'lucide-react';

interface ImageContent {
  url: string;
  textOverlay?: string;
  position?: 'top' | 'center' | 'bottom';
}

interface ContentItem {
  _id: string;
  prompt: string;
  images: ImageContent[];
  captions: string[];
  hashtags: string[];
  theme: string;
  marketingGoal: string;
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchContent(params.id as string);
    }
  }, [params.id]);

  const fetchContent = async (id: string) => {
    try {
      const response = await fetch(`/api/content?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Failed to load content');
      router.push('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: content._id,
          images: content.images,
          captions: content.captions,
          hashtags: content.hashtags,
        }),
      });

      if (!response.ok) throw new Error('Failed to save content');

      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateTextOverlay = (index: number, text: string) => {
    if (!content) return;
    const newImages = [...content.images];
    newImages[index] = { ...newImages[index], textOverlay: text };
    setContent({ ...content, images: newImages });
  };

  const updateCaption = (index: number, text: string) => {
    if (!content) return;
    const newCaptions = [...content.captions];
    newCaptions[index] = text;
    setContent({ ...content, captions: newCaptions });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!content) {
    return <div>Content not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/gallery')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600 mt-1">{content.prompt}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
          <div className="space-y-4">
            {content.images.map((image, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition ${
                  selectedImage === index ? 'ring-4 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative h-96 bg-gray-200">
                  <Image
                    src={image.url}
                    alt={`Generated image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.textOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <span className="text-white text-3xl font-bold text-center px-4">
                        {image.textOverlay}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Overlay
                  </label>
                  <input
                    type="text"
                    value={image.textOverlay || ''}
                    onChange={(e) => updateTextOverlay(index, e.target.value)}
                    placeholder="Add text overlay..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Captions & Hashtags */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Captions</h2>
            <div className="space-y-4">
              {content.captions.map((caption, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption {index + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hashtags</h2>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Theme:</strong> {content.theme}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Marketing Goal:</strong> {content.marketingGoal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
