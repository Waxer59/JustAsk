import {
  ALLOWED_JOB_OFFERS_SITES,
  ALLOWED_JOB_OFFERS_SITES_ARRAY
} from '@/constants'
import { getDomainFromUrl } from '@/helpers/getDomainFromUrl'
import type { OfferDetails, ScrapeFields } from '@/types'
import type { APIRoute } from 'astro'
import puppeteer from 'puppeteer'
import { z } from 'zod'

export const prerender = false

const isProd = import.meta.env.PROD

const urlSchema = z.string().url({ message: 'Invalid URL' })

const checkIsValidUrlAndDomain = (url: string) => {
  const isValidUrl = urlSchema.safeParse(url)

  if (!isValidUrl.success) {
    return false
  }

  const domain = getDomainFromUrl(url)
  const isValidDomain = ALLOWED_JOB_OFFERS_SITES_ARRAY.includes(domain)

  if (!isValidDomain) {
    return false
  }

  return true
}

const scrapeSite = async (
  url: string,
  { title, desc }: ScrapeFields
): Promise<OfferDetails | null> => {
  const browser = await puppeteer.launch({ headless: isProd })
  const page = await browser.newPage()

  await page.goto(url)

  await page.waitForSelector(title)
  await page.waitForSelector(desc)

  const titleElement = await page.$(title)
  const descElement = await page.$(desc)

  const titleText = (await page.evaluate((el) => el?.textContent, titleElement))
    ?.replace(/\s+/g, ' ')
    ?.trim()
  const descText = (await page.evaluate((el) => el?.textContent, descElement))
    ?.replace(/\s+/g, ' ')
    ?.trim()

  await browser.close()

  if (!titleText || !descText) {
    return null
  }

  return { title: titleText, desc: descText }
}

const extractInfojobsOffer = async (
  url: string
): Promise<OfferDetails | null> => {
  const offer = await scrapeSite(url, {
    title: '#prefijoPuesto',
    desc: '#prefijoPuesto p'
  })

  if (!offer) {
    return null
  }

  return offer
}

const extractIndeedOffer = async (
  url: string
): Promise<OfferDetails | null> => {
  const offer = await scrapeSite(url, {
    title: '[data-testid="jobsearch-JobInfoHeader-title"] > span',
    desc: '#jobDescriptionText'
  })

  if (!offer) {
    return null
  }

  return offer
}

// const extractLinkedinOffer = async (
//   url: string
// ): Promise<OfferDetails | null> => {
//   return null
// }

const extractTecnoempleoOffer = async (
  url: string
): Promise<OfferDetails | null> => {
  const offer = await scrapeSite(url, {
    title: '[itemprop="title"]',
    desc: '[itemprop="description"]'
  })

  if (!offer) {
    return null
  }

  return offer
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { url } = body

  const isValidUrl = checkIsValidUrlAndDomain(url ?? '')

  if (!isValidUrl) {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400
    })
  }

  const domain = getDomainFromUrl(url!)

  let offer

  switch (domain) {
    case ALLOWED_JOB_OFFERS_SITES.INFOJOBS:
      offer = await extractInfojobsOffer(url!)
      break
    case ALLOWED_JOB_OFFERS_SITES.INDEED:
      offer = await extractIndeedOffer(url!)
      break
    // case ALLOWED_JOB_OFFERS_SITES.LINKEDIN:
    //   offer = await extractLinkedinOffer(url!)
    //   break
    case ALLOWED_JOB_OFFERS_SITES.TECNOEMPLEO:
      offer = await extractTecnoempleoOffer(url!)
      break
  }

  if (!offer) {
    return new Response(JSON.stringify({ error: 'Offer not found' }), {
      status: 404
    })
  }

  return new Response(JSON.stringify(offer))
}
