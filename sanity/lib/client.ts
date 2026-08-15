import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, readToken, writeToken } from '../env';

const resolvedProjectId = projectId || 'dwm37627';

// Public read client (uses CDN when in production)
export const client = createClient({
  projectId: resolvedProjectId,
  dataset: dataset || 'production',
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: readToken || undefined,
  perspective: 'published',
});

// Authenticated write client for mutations
export const writeClient = createClient({
  projectId: resolvedProjectId,
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false,
  token: writeToken || undefined,
});
