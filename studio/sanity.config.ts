import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

// const projectId = process.env.SANITY_STUDIO_API_PROJECT_ID
// console.log({env: process.env})

export default defineConfig({
  name: 'default',
  title: 'next-blog-poc',

  // @TODO: Remove this from the config and use the env var instead
  projectId: 'xubxwl6m',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
