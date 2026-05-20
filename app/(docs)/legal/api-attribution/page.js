import Footer from '@/components/Footer'

export const metadata = { title: 'API Attribution — Kleegr Developers' }

export default function ApiAttributionPage() {
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Legal</div>
        <h1 className="page-title">API Attribution</h1>
      </div>
      <div className="prose">
        <h2>Kleegr CRM Platform</h2>
        <p>Kleegr is a CRM and business automation platform. The Kleegr developer API allows third-party applications to integrate with Kleegr-powered accounts, access contact and conversation data, automate workflows, process payments, and more.</p>
        <h2>Underlying Technology</h2>
        <p>Kleegr’s CRM infrastructure is built on HighLevel (GoHighLevel). Certain technical references to HighLevel appear in this documentation where required for integration accuracy:</p>
        <ul>
          <li>OAuth app registration at <code>marketplace.gohighlevel.com</code></li>
          <li>The OAuth authorization URL at <code>marketplace.leadconnectorhq.com</code></li>
          <li>OAuth scope strings (e.g. <code>conversations/message.readonly</code>)</li>
          <li>API base URLs via <code>services.leadconnectorhq.com</code></li>
          <li>Rate limit response headers (<code>X-RateLimit-*</code>)</li>
          <li>Webhook authentication public keys</li>
          <li>Marketplace provider names (LeadConnector)</li>
        </ul>
        <p>These references are retained solely for technical accuracy. Kleegr does not claim ownership of the HighLevel platform. Kleegr is a reseller and white-label operator of HighLevel infrastructure.</p>
        <h2>Documentation Source</h2>
        <p>Portions of this documentation are derived from the GoHighLevel API v2 documentation, released under the <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0 Universal (Public Domain)</a> license. No copyright claim is made over that content.</p>
        <h2>Trademarks</h2>
        <p>GoHighLevel and HighLevel are trademarks of HighLevel Inc. Their use here is purely technical and does not imply affiliation, endorsement, or sponsorship.</p>
        <h2>Contact</h2>
        <p>For questions about Kleegr integrations, visit <a href="https://kleegr.com" target="_blank" rel="noopener">kleegr.com</a>.</p>
      </div>
      <Footer />
    </div>
  )
}
