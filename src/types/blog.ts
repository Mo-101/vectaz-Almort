/**
 * Blog Types
 * Type definitions for the ultra-futuristic blog system
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishDate: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  thumbnail: string;
  featured?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  authorAvatar?: string;
  content: string;
  publishDate: string;
  likes: number;
  replies?: BlogComment[];
}

export interface BlogFilter {
  categories?: string[];
  tags?: string[];
  authors?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}
