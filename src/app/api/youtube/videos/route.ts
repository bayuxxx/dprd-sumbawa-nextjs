import { NextRequest, NextResponse } from 'next/server';

function getFallbackVideos() {
  return [
    { id: 'z38p3gX7XFw', title: 'Live: Rapat Paripurna DPRD Kab. Sumbawa Barat - Penetapan APBD 2026', channelTitle: 'DPRD Sumbawa Barat', thumbnail: 'https://img.youtube.com/vi/z38p3gX7XFw/hqdefault.jpg', publishedAt: new Date().toISOString(), viewCount: '1200' },
    { id: 'eC7i6222b40', title: 'Paripurna Masa Sidang II 2026 - Jawaban Bupati Atas Pandangan Fraksi', channelTitle: 'DPRD Sumbawa Barat', thumbnail: 'https://img.youtube.com/vi/eC7i6222b40/hqdefault.jpg', publishedAt: new Date().toISOString(), viewCount: '800' },
    { id: 'BHACKCNDMW8', title: 'Sosialisasi Perda tentang Pengelolaan Sampah Terpadu', channelTitle: 'DPRD Sumbawa Barat', thumbnail: 'https://img.youtube.com/vi/BHACKCNDMW8/hqdefault.jpg', publishedAt: new Date().toISOString(), viewCount: '540' },
  ];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxxxxxxxxxxxxxxxxxxxxxxx';
  const maxResults = parseInt(searchParams.get('maxResults') || '6');

  if (!YOUTUBE_API_KEY) return NextResponse.json({ source: 'fallback', items: getFallbackVideos() });

  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    const channelRes = await fetch(channelUrl);
    const channelData: any = await channelRes.json();
    if (channelData.error || !channelData.items?.length) return NextResponse.json({ source: 'fallback', items: getFallbackVideos() });

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const playlistRes = await fetch(playlistUrl);
    const playlistData: any = await playlistRes.json();
    if (playlistData.error || !playlistData.items) return NextResponse.json({ source: 'fallback', items: getFallbackVideos() });

    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData: any = await statsRes.json();
    const statsMap: Record<string, any> = {};
    if (statsData.items) statsData.items.forEach((item: any) => { statsMap[item.id] = item.statistics; });

    const items = playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const stats = statsMap[videoId] || {};
      return { id: videoId, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, publishedAt: item.snippet.publishedAt, channelTitle: item.snippet.channelTitle, viewCount: stats.viewCount || '0', likeCount: stats.likeCount || '0' };
    });
    return NextResponse.json({ source: 'api', items });
  } catch { return NextResponse.json({ source: 'fallback', items: getFallbackVideos() }); }
}
