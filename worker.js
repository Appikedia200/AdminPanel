import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
        }
      )
    } catch (e) {
      // If asset not found, return index.html for client-side routing
      let notFoundResponse = new Response('Not found', { status: 404 })
      try {
        let notFoundRequest = new Request(`${new URL(request.url).origin}/index.html`, request)
        return await getAssetFromKV(
          {
            request: notFoundRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
          }
        )
      } catch (e) {
        return notFoundResponse
      }
    }
  },
}

