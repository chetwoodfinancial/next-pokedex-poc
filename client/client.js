import sanityClient from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID

export default sanityClient({
  projectId, // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2022-12-19',
})
