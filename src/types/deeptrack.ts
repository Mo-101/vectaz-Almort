
/**
 * Backward Compatibility Module
 * 
 * This file re-exports all types from the domain-specific files to maintain
 * compatibility with existing imports from '@/types/deeptrack'.
 * 
 * New code should import directly from the domain-specific files.
 */

// Re-export all types from domain-specific files
export * from './shipment';
export * from './forwarder';
export * from './route';
export * from './location';
export * from './analytics';
export * from './ui';
