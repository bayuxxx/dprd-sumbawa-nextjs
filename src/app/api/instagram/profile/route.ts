import { NextResponse } from 'next/server';
import beholdData from '@/data/behold.json';

export async function GET() {
  return NextResponse.json({
    source: 'api',
    profile: {
      username: beholdData.username,
      name: beholdData.username,
      profilePicture: beholdData.profilePictureUrl,
      followersCount: beholdData.followersCount,
      followsCount: beholdData.followsCount,
      biography: beholdData.biography,
      website: beholdData.website,
      mediaCount: beholdData.posts.length,
    },
  });
}
