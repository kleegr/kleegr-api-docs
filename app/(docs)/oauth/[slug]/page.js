import { notFound } from 'next/navigation'
import { getOAuthDoc, oauthFileMap } from '@/lib/docs'
import MarkdownContent from '@/components/MarkdownContent'
import Footer from '@/components/Footer'

const titles = {
  'overview': 'OAuth 2.0 Overview',
  'authorization': 'Authorization',
  'scopes': 'Scopes',
  'external-authentication': 'External Authentication (SSO)',
  'webhook-authentication': 'Webhook Authentication',
  'billing': 'External Billing',
  'faqs': 'OAuth FAQs',
}

export function generateStaticParams() {
  return Object.keys(oauthFileMap).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const title = titles[params.slug] || 'OAuth'
  return { title: `${title} — Kleegr OAuth` }
}

export default function OAuthPage({ params }) {
  const doc = getOAuthDoc(params.slug)
  if (!doc) notFound()
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Kleegr OAuth 2.0</div>
        <h1 className="page-title">{titles[params.slug] || params.slug}</h1>
      </div>
      <MarkdownContent content={doc.content} />
      <Footer />
    </div>
  )
}
