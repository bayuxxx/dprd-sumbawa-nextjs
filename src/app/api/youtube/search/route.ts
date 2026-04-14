import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxxxxxxxxxxxxxxxxxxxxxxx';
  const query = searchParams.get('q') || '';
  const maxResults = parseInt(searchParams.get('maxResults') || '6');

  if (!YOUTUBE_API_KEY) return NextResponse.json({ source: 'fallback', items: [] });

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData: any = await searchRes.json();
    if (!searchData.items) return NextResponse.json({ source: 'fallback', items: [] });
    const items = searchData.items.map((item: any) => ({ id: item.id.videoId, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`, publishedAt: item.snippet.publishedAt, channelTitle: item.snippet.channelTitle }));
    return NextResponse.json({ source: 'api', items });
  } catch { return NextResponse.json({ source: 'fallback', items: [] }); }
}
