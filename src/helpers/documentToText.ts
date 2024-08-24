import { createWorker } from 'tesseract.js'

export const documentToText = async (buffer: Buffer): Promise<string> => {
  const worker = await createWorker(['eng', 'spa'])
  const ret = await worker.recognize(buffer)
  await worker.terminate()
  return ret.data.text
}
