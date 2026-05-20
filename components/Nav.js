import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="nav-root">
      <Link href="/" className="nav-logo">
        <div className="nav-mark">
          <svg viewBox="0 0 16 16"><path d="M2 10l3-3 2 2 5-6v3l-5 6-2-2-3 3V10z"/></svg>
        </div>
        Kleegr Developers
        <span className="nav-badge">API v2</span>
      </Link>
      <div className="nav-right">
        <Link href="/api-reference" className="nav-link">API Reference</Link>
        <Link href="/oauth/overview" className="nav-link">OAuth</Link>
        <Link href="/webhooks" className="nav-link">Webhooks</Link>
        <a href="https://crm.kleegr.com" className="nav-cta" target="_blank" rel="noopener">CRM Login</a>
      </div>
    </nav>
  )
}
