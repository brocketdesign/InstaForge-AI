'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Eye, Trash2 } from 'lucide-react';

// Helper to extract string from potentially object values
const getTextValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'text' in value) {
    return String((value as { text: unknown }).text);
  }
  return value ? String(value) : '';
};

interface ContentItem {
  _id: string;
  prompt: string;
  images: Array<{ url: string; textOverlay?: string }>;
  theme: string;
  marketingGoal: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      
      const data = await response.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/content?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      setContents(contents.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        <p className="text-gray-600 mt-2">
          View and manage all your generated content
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No content yet</p>
          <Link href="/generate">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              Generate Your First Content
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div
              key={content._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Preview Image */}
              <div className="relative h-64 bg-gray-200">
                {content.images[0] && (
                  <Image
                    src={content.images[0].url}
                    alt={content.prompt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
                {content.images[0]?.textOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-white text-2xl font-bold text-center px-4 drop-shadow-lg">
                      {getTextValue(content.images[0].textOverlay)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">
                  {content.prompt}
                </h3>
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {content.theme}
                  </span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">
                    {content.images.length} images
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(content.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/edit/${content._id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(content._id)}
                    disabled={deleting === content._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {deleting === content._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
