import { BASE_URL } from './config';

export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  viewCount?: string;
  likeCount?: string;
}

export interface YouTubeResponse {
  source: 'api' | 'fallback';
  items: YouTubeVideo[];
}

export async function fetchYouTubeVideos(maxResults: number = 6): Promise<YouTubeResponse> {
  try {
    const res = await fetch(`${BASE_URL}/youtube/videos?maxResults=${maxResults}`);
    if (!res.ok) return { source: 'fallback', items: [] };
    return res.json();
  } catch {
    return { source: 'fallback', items: [] };
  }
}

export async function searchYouTubeVideos(query: string, maxResults: number = 6): Promise<YouTubeResponse> {
  try {
    const res = await fetch(`${BASE_URL}/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    if (!res.ok) return { source: 'fallback', items: [] };
    return res.json();
  } catch {
    return { source: 'fallback', items: [] };
  }
}
