import { notFound } from 'next/navigation'
import { getWebhookDoc, webhookFileMap } from '@/lib/docs'
import MarkdownContent from '@/components/MarkdownContent'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return Object.keys(webhookFileMap).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const label = params.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
  return { title: `${label} — Kleegr Webhooks` }
}

export default function WebhookPage({ params }) {
  const doc = getWebhookDoc(params.slug)
  if (!doc) notFound()
  const label = params.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Kleegr Webhooks</div>
        <h1 className="page-title" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.6rem' }}>{label}</h1>
      </div>
      <MarkdownContent content={doc.content} />
      <Footer />
    </div>
  )
}
