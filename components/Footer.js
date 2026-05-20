import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="docs-footer">
      <span>© {new Date().getFullYear()} Kleegr</span>
      <div className="footer-links">
        <a href="https://kleegr.com" target="_blank" rel="noopener">kleegr.com</a>
        <a href="https://crm.kleegr.com" target="_blank" rel="noopener">CRM Login</a>
        <Link href="/legal/api-attribution">API Attribution</Link>
      </div>
    </footer>
  )
}
