import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { userId } = await clerkAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db('instaforge');

    if (id) {
      // Get specific content item
      const content = await db.collection('content').findOne({
        _id: new ObjectId(id),
        userId,
      });

      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      return NextResponse.json(content);
    }

    // Get all content for user
    const contents = await db
      .collection('content')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await clerkAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('instaforge');

    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await clerkAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('instaforge');

    const result = await db.collection('content').deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
