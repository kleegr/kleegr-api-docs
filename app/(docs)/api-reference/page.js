import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = { title: 'API Reference — Kleegr Developers' }

const apis = [
  { slug: 'contacts', icon: '👤', title: 'Contacts', desc: 'Create, update, search, and tag contacts' },
  { slug: 'conversations', icon: '💬', title: 'Conversations', desc: 'Send and receive messages across all channels' },
  { slug: 'calendars', icon: '📅', title: 'Calendars', desc: 'Manage calendars, slots, and appointments' },
  { slug: 'opportunities', icon: '📈', title: 'Opportunities', desc: 'Track pipeline stages and deal values' },
  { slug: 'invoices', icon: '🧾', title: 'Invoices', desc: 'Create, send, and track invoices' },
  { slug: 'payments', icon: '💳', title: 'Payments', desc: 'Process payments and subscriptions' },
  { slug: 'users', icon: '🔑', title: 'Users', desc: 'Manage CRM users and permissions' },
  { slug: 'workflows', icon: '⚡', title: 'Workflows', desc: 'Trigger and manage automation workflows' },
  { slug: 'locations', icon: '🏢', title: 'Locations', desc: 'Create and configure sub-accounts' },
  { slug: 'businesses', icon: '🏙️', title: 'Businesses', desc: 'Manage business records' },
  { slug: 'forms', icon: '📋', title: 'Forms', desc: 'Retrieve form definitions and submissions' },
  { slug: 'surveys', icon: '📊', title: 'Surveys', desc: 'Access survey data and responses' },
  { slug: 'products', icon: '📦', title: 'Products', desc: 'Manage products and pricing' },
  { slug: 'blogs', icon: '✍️', title: 'Blogs', desc: 'Manage blog content' },
  { slug: 'funnels', icon: '🔽', title: 'Funnels', desc: 'Build and manage funnels' },
  { slug: 'social-media-posting', icon: '📱', title: 'Social Planner', desc: 'Schedule and manage social posts' },
  { slug: 'snapshots', icon: '📸', title: 'Snapshots', desc: 'Account configuration snapshots' },
  { slug: 'medias', icon: '🖼️', title: 'Media Library', desc: 'Manage files and media assets' },
  { slug: 'links', icon: '🔗', title: 'Trigger Links', desc: 'Manage trigger links' },
  { slug: 'emails', icon: '📧', title: 'Emails', desc: 'Send and manage emails' },
  { slug: 'marketplace', icon: '🛒', title: 'Marketplace', desc: 'Manage marketplace apps and installs' },
  { slug: 'saas-api', icon: '☁️', title: 'SaaS API', desc: 'SaaS reseller and billing tools' },
  { slug: 'custom-menus', icon: '📂', title: 'Custom Menus', desc: 'Manage custom navigation items' },
  { slug: 'custom-fields', icon: '🗂️', title: 'Custom Fields', desc: 'Define and manage custom fields' },
  { slug: 'objects', icon: '🔷', title: 'Custom Objects', desc: 'Create and manage custom object schemas' },
  { slug: 'associations', icon: '🔀', title: 'Associations', desc: 'Link records with associations' },
  { slug: 'companies', icon: '🏪', title: 'Companies', desc: 'Manage company records' },
  { slug: 'courses', icon: '🎓', title: 'Courses', desc: 'Membership and course management' },
  { slug: 'email-isv', icon: '📨', title: 'LC Email', desc: 'LeadConnector email integration' },
  { slug: 'campaigns', icon: '📣', title: 'Campaigns', desc: 'Manage drip campaigns' },
  { slug: 'oauth', icon: '🔐', title: 'OAuth API', desc: 'Programmatic OAuth token management' },
]

export default function ApiReferenceIndex() {
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Kleegr API Reference</div>
        <h1 className="page-title">All APIs</h1>
        <p className="page-desc">Browse the full Kleegr API surface. Click any domain to open its interactive reference.</p>
      </div>
      <div className="card-grid">
        {apis.map((api) => (
          <Link key={api.slug} href={`/api-reference/${api.slug}`} className="doc-card">
            <div className="doc-card-icon">{api.icon}</div>
            <div className="doc-card-title">{api.title}</div>
            <div className="doc-card-desc">{api.desc}</div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  )
}
