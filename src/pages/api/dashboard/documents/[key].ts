import { R2Buckets } from '@/constants'
import { s3Client } from '@/lib/s3Client'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { key } = params

  const documents = await s3Client.send(
    new GetObjectCommand({
      Bucket: R2Buckets.justask,
      Key: `${user.id}/${key}`
    })
  )

  if (!documents.Body) {
    return new Response(null, {
      status: 404
    })
  }

  return new Response(
    JSON.stringify({
      documents: documents.Body.toString()
    }),
    { status: 200 }
  )
}
