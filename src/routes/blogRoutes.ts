/**
 * Blog Routes Configuration
 * Ultra-futuristic blog system for logistics innovations and updates
 */

import { BlogPost } from '@/types/blog';

// Filter for blog routes - matches any path starting with /blog
export const blogRouteFilter = (path: string): boolean => /^\/blog/g.test(path);

// Featured blog posts
export const featuredPosts: BlogPost[] = [
  {
    id: 'voice-integration-logistics',
    slug: 'voice-integration-logistics',
    title: 'Voice Integration Revolutionizes Logistics Operations',
    excerpt: 'How our ultra-futuristic voice system transforms the way logistics professionals interact with freight data.',
    publishDate: '2025-05-15',
    author: 'Aria Chen',
    category: 'technology',
    tags: ['voice', 'ai', 'logistics', 'innovation'],
    readTime: 5,
    thumbnail: '/assets/images/blog/voice-logistics.webp'
  },
  {
    id: 'deepcal-freight-ai',
    slug: 'deepcal-freight-ai',
    title: 'DeepCAL: The Future of Freight Forwarding Intelligence',
    excerpt: 'Exploring how our advanced AI model analyzes and optimizes global freight operations in real-time.',
    publishDate: '2025-05-10',
    author: 'Marcus Webb',
    category: 'ai',
    tags: ['deepcal', 'analytics', 'freight-forwarding', 'ai'],
    readTime: 7,
    thumbnail: '/assets/images/blog/deepcal-analytics.webp'
  },
  {
    id: 'training-freight-models',
    slug: 'training-freight-models',
    title: 'Training Next-Gen Freight Forwarding Models',
    excerpt: 'A deep dive into our cutting-edge training pipeline for logistics optimization models.',
    publishDate: '2025-05-05',
    author: 'Sophia Lei',
    category: 'development',
    tags: ['training', 'models', 'optimization', 'machine-learning'],
    readTime: 8,
    thumbnail: '/assets/images/blog/training-models.webp'
  }
];

// Get all blog posts (would typically come from an API or CMS)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  // In a real implementation, this would fetch from an API
  // For demo purposes, we're returning the featured posts
  return Promise.resolve(featuredPosts);
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  return Promise.resolve(featuredPosts.find(post => post.slug === slug));
};

// Get related posts
export const getRelatedPosts = async (currentPostId: string, limit: number = 2): Promise<BlogPost[]> => {
  return Promise.resolve(
    featuredPosts.filter(post => post.id !== currentPostId).slice(0, limit)
  );
};
