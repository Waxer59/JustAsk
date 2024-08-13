import type { APIRoute } from 'astro'

export const prerender = false

const JSEARCH_API_KEY = import.meta.env.JSEARCH_API_KEY
const RAPID_API_HOST = import.meta.env.RAPID_API_HOST

export const GET: APIRoute = async ({ params }) => {
  const { offer } = params

  try {
    const resp = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${offer}`,
      {
        headers: {
          'X-RapidAPI-Key': JSEARCH_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST
        }
      }
    )

    const data = await resp.json()
    return new Response(JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }

  return new Response(null, {
    status: 500
  })
}
