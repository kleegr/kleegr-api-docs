import { notFound } from 'next/navigation'
import { apiFileMap, getApiSpecTitle } from '@/lib/docs'
import ApiViewer from '@/components/ApiViewer'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return Object.keys(apiFileMap).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const title = getApiSpecTitle(params.slug)
  return { title: `${title} — Kleegr API Reference` }
}

export default function ApiReferencePage({ params }) {
  const { slug } = params
  if (!apiFileMap[slug]) notFound()
  const title = getApiSpecTitle(slug)
  const specUrl = `/api/specs/${apiFileMap[slug]}`
  return (
    <div className="docs-content" style={{ maxWidth: '100%', padding: '32px 0 0' }}>
      <div style={{ padding: '0 48px 24px' }}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div className="page-eyebrow">Kleegr API Reference</div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
      <ApiViewer specUrl={specUrl} title={title} />
      <div style={{ padding: '0 48px' }}>
        <Footer />
      </div>
    </div>
  )
}
