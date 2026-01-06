import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { userId } = await clerkAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('instaforge');

    const [contents, total] = await Promise.all([
      db
        .collection('content')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('content').countDocuments({ userId }),
    ]);

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}
