import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    try {
      // Try to get the asset from KV
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          mapRequestToAsset: req => {
            const url = new URL(req.url)
            let pathname = url.pathname
            
            // Map root to index.html
            if (pathname === '/' || pathname === '') {
              pathname = '/server/app/index.html'
            }
            // Map routes to server/app/*.html
            else if (!pathname.startsWith('/_next/') && !pathname.includes('.')) {
              // Remove trailing slash
              pathname = pathname.replace(/\/$/, '')
              pathname = `/server/app${pathname}.html`
            }
            // Static assets stay as-is (they're in the right place)
            
            url.pathname = pathname
            return new Request(url.toString(), req)
          }
        }
      )
    } catch (e) {
      console.error('Asset fetch error:', e.message)
      
      // Fallback to index.html for client-side routing
      try {
        const indexRequest = new Request(`${url.origin}/server/app/index.html`, request)
        return await getAssetFromKV(
          {
            request: indexRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          }
        )
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError.message)
        return new Response('Page not found', { 
          status: 404,
          headers: { 'content-type': 'text/plain' }
        })
      }
    }
  },
}
