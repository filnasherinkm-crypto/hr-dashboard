import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './sanity/schemaTypes';
import { apiVersion, dataset, projectId } from './sanity/env';

export default defineConfig({
  basePath: '/studio',
  name: 'Filna_HR_Portal_Studio',
  title: 'Filna HR Portal — Sanity Studio',
  projectId: projectId || 'dwm37627',
  dataset: dataset || 'production',
  schema,
  plugins: [structureTool()],
});
