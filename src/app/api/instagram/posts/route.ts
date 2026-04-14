import { NextRequest, NextResponse } from 'next/server';
import beholdData from '@/data/behold.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '6');

  const items = beholdData.posts.slice(0, limit * 2).filter((post: any) => !post.isReel).slice(0, limit).map((post: any) => ({
    id: post.id,
    caption: post.prunedCaption || post.caption || '',
    mediaType: post.mediaType,
    mediaUrl: post.mediaType === 'VIDEO'
      ? (post.thumbnailUrl || post.sizes?.medium?.mediaUrl || post.mediaUrl)
      : (post.sizes?.medium?.mediaUrl || post.mediaUrl),
    permalink: post.permalink,
    timestamp: post.timestamp,
    isReel: post.isReel || false,
  }));

  return NextResponse.json({ source: 'api', items });
}
