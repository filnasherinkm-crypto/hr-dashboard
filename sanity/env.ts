export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dwm37627';

export const readToken = process.env.SANITY_API_READ_TOKEN || '';
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || '';

export const isSanityConfigured = Boolean(projectId && dataset);
