import { BASE_URL } from './config';

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
  isReel?: boolean;
}

export interface InstagramResponse {
  source: 'api' | 'fallback';
  items: InstagramPost[];
}

export interface InstagramProfile {
  username: string;
  name: string;
  profilePicture?: string | null;
  followersCount?: number;
  mediaCount?: number;
}

export interface InstagramProfileResponse {
  source: 'api' | 'fallback';
  profile: InstagramProfile;
}

export async function fetchInstagramPosts(limit: number = 6): Promise<InstagramResponse> {
  try {
    const res = await fetch(`${BASE_URL}/instagram/posts?limit=${limit}`);
    if (!res.ok) return { source: 'fallback', items: [] };
    return res.json();
  } catch {
    return { source: 'fallback', items: [] };
  }
}

export async function fetchInstagramProfile(): Promise<InstagramProfileResponse> {
  try {
    const res = await fetch(`${BASE_URL}/instagram/profile`);
    if (!res.ok) return { source: 'fallback', profile: { username: 'humas.dprdksb', name: 'Humas DPRD KSB' } };
    return res.json();
  } catch {
    return { source: 'fallback', profile: { username: 'humas.dprdksb', name: 'Humas DPRD KSB' } };
  }
}
