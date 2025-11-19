import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      
      // Handle favicon
      if (url.pathname === '/favicon.ico') {
        return new Response('', { status: 404 })
      }
      
      // Handle Next.js routing
      let targetPath = url.pathname
      if (targetPath === '/') {
        targetPath = '/index.html'
      } else if (!targetPath.includes('.') && !targetPath.endsWith('/')) {
        targetPath = targetPath + '/index.html'
      } else if (targetPath.endsWith('/')) {
        targetPath = targetPath + 'index.html'
      }
      
      const modifiedUrl = new URL(request.url)
      modifiedUrl.pathname = targetPath
      
      const modifiedRequest = new Request(modifiedUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
      
      return await getAssetFromKV(
        {
          request: modifiedRequest,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST || '{}'),
        }
      )
    } catch (e) {
      console.error('Worker error:', e)
      
      // Handle 404s - serve index.html for SPA
      if (e.status === 404 || (e.message && e.message.includes('could not find'))) {
        try {
          const indexUrl = new URL(request.url)
          indexUrl.pathname = '/index.html'
          const indexRequest = new Request(indexUrl.toString(), {
            method: request.method,
            headers: request.headers,
          })
          
          return await getAssetFromKV(
            {
              request: indexRequest,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST || '{}'),
            }
          )
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError)
          return new Response('Page not found', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          })
        }
      }
      
      return new Response(`Error: ${e.message || 'Unknown error'}`, { 
        status: e.status || 500,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
  }
}

