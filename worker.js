export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      
      // Get the asset manifest
      const manifest = JSON.parse(env.__STATIC_CONTENT_MANIFEST || '{}')
      
      // Determine the file path
      let assetKey = url.pathname
      
      // Remove leading slash first
      if (assetKey.startsWith('/')) {
        assetKey = assetKey.slice(1)
      }
      
      // Handle HTML pages
      if (!assetKey && assetKey !== '0') {
        // Root path
        assetKey = 'server/app/index.html'
      } else if (!assetKey.includes('.') && !assetKey.startsWith('_next/')) {
        // Remove trailing slash
        if (assetKey.endsWith('/')) {
          assetKey = assetKey.slice(0, -1)
        }
        
        // Map to server/app HTML files
        assetKey = 'server/app/' + assetKey + '.html'
      }
      
      console.log('DEBUG - Looking for:', assetKey)
      console.log('DEBUG - Manifest keys:', Object.keys(manifest).filter(k => k.includes('server/app')).slice(0, 10))
      
      // Look up the asset in the manifest (manifest maps unhashed -> hashed names)
      const assetPath = manifest[assetKey] || assetKey
      console.log('DEBUG - Found path:', assetPath)
      
      // Fetch from KV
      const content = await env.__STATIC_CONTENT.get(assetPath, { type: 'arrayBuffer' })
      
      if (!content) {
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
      console.error('Worker error:', e)
      
      // Try to serve index.html as fallback
      try {
        const manifest = JSON.parse(env.__STATIC_CONTENT_MANIFEST || '{}')
        const indexPath = manifest['server/app/index.html'] || 'server/app/index.html'
        const content = await env.__STATIC_CONTENT.get(indexPath, { type: 'arrayBuffer' })
        
        if (content) {
          return new Response(content, {
            headers: {
              'Content-Type': 'text/html',
            },
          })
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
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
    'html': 'text/html',
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
