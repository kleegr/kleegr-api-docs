import { notFound } from 'next/navigation'
import { getMarketplaceDoc, marketplaceFileMap } from '@/lib/docs'
import MarkdownContent from '@/components/MarkdownContent'
import Footer from '@/components/Footer'

const titles = {
  'user-context': 'User Context in Marketplace Apps',
  'custom-js': 'Custom JavaScript',
  'conversation-providers': 'Conversation Providers',
}

export function generateStaticParams() {
  return Object.keys(marketplaceFileMap).map((slug) => ({ slug }))
}

export default function MarketplacePage({ params }) {
  const doc = getMarketplaceDoc(params.slug)
  if (!doc) notFound()
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Kleegr Marketplace Modules</div>
        <h1 className="page-title">{titles[params.slug] || params.slug}</h1>
      </div>
      <MarkdownContent content={doc.content} />
      <Footer />
    </div>
  )
}
