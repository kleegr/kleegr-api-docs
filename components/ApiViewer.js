'use client'
import { useEffect, useRef, useState } from 'react'

export default function ApiViewer({ specUrl, title }) {
  const mountRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mountEl = mountRef.current

    async function init() {
      try {
        const res = await fetch(specUrl)
        if (!res.ok) throw new Error('Spec not found')

        if (!document.getElementById('swagger-ui-css')) {
          const link = document.createElement('link')
          link.id = 'swagger-ui-css'
          link.rel = 'stylesheet'
          link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css'
          document.head.appendChild(link)
        }

        await new Promise((resolve, reject) => {
          if (window.SwaggerUIBundle) return resolve()
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })

        if (mountEl) {
          window.SwaggerUIBundle({
            url: specUrl,
            domNode: mountEl,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIBundle.SwaggerUIStandalonePreset,
            ],
            layout: 'BaseLayout',
            deepLinking: true,
            defaultModelsExpandDepth: 1,
          })
          setLoading(false)
        }
      } catch {
        setError(true)
        setLoading(false)
      }
    }

    init()
  }, [specUrl])

  if (error) {
    return (
      <div className="api-not-found">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Spec not yet uploaded</div>
        <p style={{ fontSize: '0.9rem', color: '#92400e', margin: 0 }}>
          The OpenAPI spec for <strong>{title}</strong> has not been pushed to the repository yet.
          See <code>apps/README.md</code> for the one-command upload instructions.
        </p>
      </div>
    )
  }

  return (
    <div className="api-viewer-wrap">
      {loading && (
        <div style={{ padding: '48px 48px', color: '#9ca3af', fontSize: '0.9rem' }}>
          Loading {title}…
        </div>
      )}
      <div ref={mountRef} style={{ display: loading ? 'none' : 'block' }} />
    </div>
  )
}
