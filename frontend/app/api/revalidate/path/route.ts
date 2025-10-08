import {parseBody} from 'next-sanity/webhook'
import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'

type WebhookPayload = {
  path: string
  type?: 'page' | 'layout'
}

/**
 * Route API pour revalider un chemin spécifique
 * Utile pour revalider des pages individuelles
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({message, isValidSignature, body}), {
        status: 401,
      })
    } else if (!body?.path) {
      const message = 'Bad Request: path is required'
      return new Response(JSON.stringify({message, body}), {status: 400})
    }

    // Revalider le chemin spécifié
    // Le type par défaut est 'page', mais peut être 'layout' pour revalider toute une arborescence
    const type = body.type || 'page'
    revalidatePath(body.path, type)

    return NextResponse.json({
      revalidated: true,
      path: body.path,
      type,
      now: Date.now(),
    })
  } catch (err) {
    console.error(err)
    return new Response((err as Error).message, {status: 500})
  }
}
