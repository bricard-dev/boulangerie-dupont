import {revalidatePath, revalidateTag} from 'next/cache'
import {NextResponse} from 'next/server'

/**
 * Route de test pour la revalidation manuelle
 * ⚠️ À DÉSACTIVER EN PRODUCTION pour des raisons de sécurité
 *
 * Usage:
 * - GET /api/revalidate/test?tag=post
 * - GET /api/revalidate/test?path=/posts/mon-article
 */
export async function GET(request: Request) {
  // Désactiver en production
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not available in production', {status: 403})
  }

  const {searchParams} = new URL(request.url)
  const tag = searchParams.get('tag')
  const path = searchParams.get('path')

  if (!tag && !path) {
    return NextResponse.json(
      {
        error: 'Veuillez fournir soit un "tag" soit un "path"',
        examples: ['/api/revalidate/test?tag=post', '/api/revalidate/test?path=/posts/mon-article'],
      },
      {status: 400},
    )
  }

  try {
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        value: tag,
        now: Date.now(),
      })
    }

    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        value: path,
        now: Date.now(),
      })
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: (err as Error).message,
      },
      {status: 500},
    )
  }
}
