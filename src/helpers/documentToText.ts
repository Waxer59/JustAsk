// @ts-expect-error no types
import scribe from 'scribe.js-ocr/scribe.js'

let isScribeInitialized = false

export const documentToText = async (file: File): Promise<string> => {
  if (!isScribeInitialized) {
    await scribe.init({ ocr: true, font: true })
    isScribeInitialized = true
  }
  const text = await scribe.extractText([file])
  return text
}
