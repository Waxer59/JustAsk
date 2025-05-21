import { R2Buckets } from '@/constants'
import { s3Client } from '@/lib/s3Client'
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3'
import type { APIRoute } from 'astro'
import { z } from 'astro:content'
export const POST: APIRoute = async ({ locals, request }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const files: File[] = []

  for (const [key, value] of formData.entries()) {
    if (key === 'file' && value instanceof File) {
      files.push(value)
    }
  }

  if (files.length === 0) {
    return new Response(
      JSON.stringify({
        error: 'No files uploaded'
      }),
      { status: 400 }
    )
  }

  await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      const content = Buffer.from(arrayBuffer)
      const key = `${user.id}/${file.name}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2Buckets.justask,
          Key: key,
          Body: content,
          ContentType: file.type
        })
      )
    })
  )

  return new Response(
    JSON.stringify({
      success: true
    }),
    { status: 200 }
  )
}

const deleteBodySchema = z.object({
  files: z.string().array()
})

export const DELETE: APIRoute = async ({ locals, request }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const { error } = deleteBodySchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const { files } = body

  await Promise.all(
    files.map(async (file: string) => {
      const key = `${user.id}/${file}`
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: R2Buckets.justask,
          Key: key
        })
      )
    })
  )

  return new Response(
    JSON.stringify({
      success: true
    }),
    { status: 200 }
  )
}

export const GET: APIRoute = async ({ locals }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const documents = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: R2Buckets.justask,
      Prefix: `${user.id}/`
    })
  )

  if (!documents.Contents) {
    return new Response(null, {
      status: 404
    })
  }

  return new Response(
    JSON.stringify({
      documents: documents.Contents.map(({ Key, ...rest }) => ({
        name: Key?.split('/').pop(),
        ...rest
      }))
    }),
    { status: 200 }
  )
}
