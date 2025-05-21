import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: import.meta.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY
  }
})
