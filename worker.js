export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      let assetKey = url.pathname
      
      // Remove leading slash
      if (assetKey.startsWith('/')) {
        assetKey = assetKey.slice(1)
      }
      
      // Determine which file to serve
      if (!assetKey) {
        // Root path
        assetKey = 'server/app/index.html'
      } else if (!assetKey.includes('.') && !assetKey.startsWith('_next/')) {
        // HTML page routes
        if (assetKey.endsWith('/')) {
          assetKey = assetKey.slice(0, -1)
        }
        assetKey = 'server/app/' + assetKey + '.html'
      }
      
      console.log('Fetching asset:', assetKey)
      
      // Fetch directly from KV without manifest
      const content = await env.__STATIC_CONTENT.get(assetKey, { type: 'arrayBuffer' })
      
      if (!content) {
        console.error('Asset not found:', assetKey)
        throw new Error('Asset not found: ' + assetKey)
      }
      
      // Determine content type
      const contentType = getContentType(assetKey)
      
      return new Response(content, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch (e) {
      console.error('Worker error:', e.message || e)
      
      // Try to serve index.html as fallback for client-side routing
      try {
        const content = await env.__STATIC_CONTENT.get('server/app/index.html', { 
          type: 'arrayBuffer' 
        })
        
        if (content) {
          return new Response(content, {
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'public, max-age=3600',
            },
          })
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError.message || fallbackError)
      }
      
      return new Response('Page not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  }
}

function getContentType(path) {
  const ext = path.split('.').pop()
  const types = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
  }
  return types[ext] || 'application/octet-stream'
}
