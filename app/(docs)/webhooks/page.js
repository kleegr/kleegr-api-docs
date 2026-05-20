import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = { title: 'Webhook Events — Kleegr Developers' }

const eventGroups = [
  { title: 'App Lifecycle', events: [
    { slug: 'app-install', label: 'AppInstall', desc: 'App installed on a location' },
    { slug: 'app-uninstall', label: 'AppUninstall', desc: 'App uninstalled from a location' },
  ]},
  { title: 'Contacts', events: [
    { slug: 'contact-create', label: 'ContactCreate', desc: 'New contact created' },
    { slug: 'contact-update', label: 'ContactUpdate', desc: 'Contact fields updated' },
    { slug: 'contact-delete', label: 'ContactDelete', desc: 'Contact deleted' },
    { slug: 'contact-tag-update', label: 'ContactTagUpdate', desc: 'Contact tags changed' },
    { slug: 'contact-dnd-update', label: 'ContactDndUpdate', desc: 'DND settings updated' },
  ]},
  { title: 'Messages', events: [
    { slug: 'inbound-message', label: 'InboundMessage', desc: 'Contact sent a message' },
    { slug: 'outbound-message', label: 'OutboundMessage', desc: 'User sent a message' },
    { slug: 'provider-outbound-message', label: 'ProviderOutboundMessage', desc: 'Outbound via custom provider' },
  ]},
  { title: 'Appointments', events: [
    { slug: 'appointment-create', label: 'AppointmentCreate', desc: 'New appointment booked' },
    { slug: 'appointment-update', label: 'AppointmentUpdate', desc: 'Appointment details changed' },
    { slug: 'appointment-delete', label: 'AppointmentDelete', desc: 'Appointment cancelled' },
  ]},
  { title: 'Opportunities', events: [
    { slug: 'opportunity-create', label: 'OpportunityCreate', desc: 'New opportunity created' },
    { slug: 'opportunity-update', label: 'OpportunityUpdate', desc: 'Opportunity updated' },
    { slug: 'opportunity-delete', label: 'OpportunityDelete', desc: 'Opportunity deleted' },
    { slug: 'opportunity-stage-update', label: 'OpportunityStageUpdate', desc: 'Pipeline stage changed' },
  ]},
  { title: 'Invoices & Orders', events: [
    { slug: 'invoice-create', label: 'InvoiceCreate', desc: 'Invoice created' },
    { slug: 'invoice-sent', label: 'InvoiceSent', desc: 'Invoice sent to contact' },
    { slug: 'invoice-paid', label: 'InvoicePaid', desc: 'Invoice fully paid' },
    { slug: 'invoice-partially-paid', label: 'InvoicePartiallyPaid', desc: 'Partial payment received' },
    { slug: 'invoice-void', label: 'InvoiceVoid', desc: 'Invoice voided' },
    { slug: 'order-create', label: 'OrderCreate', desc: 'New order placed' },
    { slug: 'order-status-update', label: 'OrderStatusUpdate', desc: 'Order status changed' },
  ]},
  { title: 'Notes, Tasks & Users', events: [
    { slug: 'note-create', label: 'NoteCreate', desc: 'Note added to a contact' },
    { slug: 'task-create', label: 'TaskCreate', desc: 'Task created' },
    { slug: 'task-complete', label: 'TaskComplete', desc: 'Task marked complete' },
    { slug: 'user-create', label: 'UserCreate', desc: 'New CRM user created' },
  ]},
  { title: 'Products & Pricing', events: [
    { slug: 'product-create', label: 'ProductCreate', desc: 'Product created' },
    { slug: 'product-update', label: 'ProductUpdate', desc: 'Product updated' },
    { slug: 'product-delete', label: 'ProductDelete', desc: 'Product deleted' },
    { slug: 'price-create', label: 'PriceCreate', desc: 'Price created' },
    { slug: 'price-update', label: 'PriceUpdate', desc: 'Price updated' },
    { slug: 'price-delete', label: 'PriceDelete', desc: 'Price deleted' },
  ]},
  { title: 'Custom Objects & Records', events: [
    { slug: 'object-schema-create', label: 'ObjectSchemaCreate', desc: 'Custom object schema created' },
    { slug: 'record-create', label: 'RecordCreate', desc: 'Record created' },
    { slug: 'record-update', label: 'RecordUpdate', desc: 'Record updated' },
    { slug: 'record-delete', label: 'RecordDelete', desc: 'Record deleted' },
    { slug: 'relation-create', label: 'RelationCreate', desc: 'Relation created' },
    { slug: 'association-create', label: 'AssociationCreate', desc: 'Association defined' },
  ]},
  { title: 'Locations & Plans', events: [
    { slug: 'location-create', label: 'LocationCreate', desc: 'Sub-account created' },
    { slug: 'location-update', label: 'LocationUpdate', desc: 'Sub-account updated' },
    { slug: 'plan-change', label: 'PlanChange', desc: 'App plan changed' },
    { slug: 'lc-email-stats', label: 'LCEmailStats', desc: 'Email delivery statistics' },
  ]},
]

export default function WebhooksIndex() {
  return (
    <div className="docs-content">
      <div className="page-header">
        <div className="page-eyebrow">Kleegr Webhooks</div>
        <h1 className="page-title">Webhook Events</h1>
        <p className="page-desc">
          Register a webhook URL in your Kleegr marketplace app to receive real-time payloads.
          Every event includes <code>locationId</code> and <code>type</code> fields.
        </p>
      </div>
      {eventGroups.map((group) => (
        <div key={group.title} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, color: '#374151', letterSpacing: '-0.01em' }}>
            {group.title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 8 }}>
            {group.events.map((ev) => (
              <Link
                key={ev.slug}
                href={`/webhooks/${ev.slug}`}
                className="doc-card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>{ev.label}</div>
                  <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: 2 }}>{ev.desc}</div>
                </div>
                <span style={{ color: '#d1d5db', marginLeft: 8 }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <Footer />
    </div>
  )
}
