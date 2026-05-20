import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const root = process.cwd()

export const oauthFileMap = {
  'overview': 'Overview',
  'authorization': 'Authorization',
  'scopes': 'Scopes',
  'external-authentication': 'ExternalAuthentication',
  'webhook-authentication': 'WebhookAuthentication',
  'billing': 'Billing',
  'faqs': 'Faqs',
}

export const webhookFileMap = {
  'app-install': 'AppInstall',
  'app-uninstall': 'AppUninstall',
  'contact-create': 'ContactCreate',
  'contact-update': 'ContactUpdate',
  'contact-delete': 'ContactDelete',
  'contact-tag-update': 'ContactTagUpdate',
  'contact-dnd-update': 'ContactDndUpdate',
  'conversation-unread': 'ConversationUnreadWebhook',
  'inbound-message': 'InboundMessage',
  'outbound-message': 'OutboundMessage',
  'provider-outbound-message': 'ProviderOutboundMessage',
  'appointment-create': 'AppointmentCreate',
  'appointment-update': 'AppointmentUpdate',
  'appointment-delete': 'AppointmentDelete',
  'campaign-status-update': 'CampaignStatusUpdate',
  'opportunity-create': 'OpportunityCreate',
  'opportunity-update': 'OpportunityUpdate',
  'opportunity-delete': 'OpportunityDelete',
  'opportunity-stage-update': 'OpportunityStageUpdate',
  'opportunity-status-update': 'OpportunityStatusUpdate',
  'opportunity-monetary-value-update': 'OpportunityMonetaryValueUpdate',
  'opportunity-assigned-to-update': 'OpportunityAssignedToUpdate',
  'invoice-create': 'InvoiceCreate',
  'invoice-sent': 'InvoiceSent',
  'invoice-paid': 'InvoicePaid',
  'invoice-void': 'InvoiceVoid',
  'invoice-update': 'InvoiceUpdate',
  'invoice-delete': 'InvoiceDelete',
  'invoice-partially-paid': 'InvoicePartiallyPaid',
  'order-create': 'OrderCreate',
  'order-status-update': 'OrderStatusUpdate',
  'note-create': 'NoteCreate',
  'note-update': 'NoteUpdate',
  'note-delete': 'NoteDelete',
  'task-create': 'TaskCreate',
  'task-delete': 'TaskDelete',
  'task-complete': 'TaskComplete',
  'plan-change': 'PlanChange',
  'product-create': 'ProductCreate',
  'product-update': 'ProductUpdate',
  'product-delete': 'ProductDelete',
  'price-create': 'PriceCreate',
  'price-update': 'PriceUpdate',
  'price-delete': 'PriceDelete',
  'user-create': 'UserCreate',
  'location-create': 'LocationCreate',
  'location-update': 'LocationUpdate',
  'lc-email-stats': 'LCEmailStats',
  'object-schema-create': 'ObjectSchemaCreate',
  'object-schema-update': 'ObjectSchemaUpdate',
  'record-create': 'RecordCreate',
  'record-update': 'RecordUpdate',
  'record-delete': 'RecordDelete',
  'relation-create': 'RelationCreate',
  'relation-delete': 'RelationDelete',
  'association-create': 'AssociationCreate',
  'association-update': 'AssociationUpdate',
  'association-delete': 'AssociationDelete',
}

export const marketplaceFileMap = {
  'user-context': 'shared_secret_customJS_customPages',
  'custom-js': 'CustomJs',
  'conversation-providers': 'ConversationProviders',
}

export const apiFileMap = {
  'ad-manager': 'ad-manager',
  'affiliate-manager': 'affiliate-manager',
  'agent-studio': 'agent-studio',
  'associations': 'associations',
  'blogs': 'blogs',
  'brand-boards': 'brand-boards',
  'businesses': 'businesses',
  'calendars': 'calendars',
  'campaigns': 'campaigns',
  'companies': 'companies',
  'contacts': 'contacts',
  'conversation-ai': 'conversation-ai',
  'conversations': 'conversations',
  'courses': 'courses',
  'custom-fields': 'custom-fields',
  'custom-menus': 'custom-menus',
  'email-isv': 'email-isv',
  'emails': 'emails',
  'forms': 'forms',
  'funnels': 'funnels',
  'invoices': 'invoices',
  'knowledge-base': 'knowledge-base',
  'links': 'links',
  'locations': 'locations',
  'marketplace': 'marketplace',
  'medias': 'medias',
  'oauth': 'oauth',
  'objects': 'objects',
  'opportunities': 'opportunities',
  'payments': 'payments',
  'phone-system': 'phone-system',
  'products': 'products',
  'proposals': 'proposals',
  'saas-api': 'saas-api',
  'snapshots': 'snapshots',
  'social-media-posting': 'social-media-posting',
  'store': 'store',
  'surveys': 'surveys',
  'users': 'users',
  'voice-ai': 'voice-ai',
  'workflows': 'workflows',
}

function readMd(filePath) {
  if (!existsSync(filePath)) return null
  const raw = readFileSync(filePath, 'utf8')
  const { content, data } = matter(raw)
  return { content: content.trim(), frontmatter: data }
}

export function getOAuthDoc(slug) {
  const fileName = oauthFileMap[slug]
  if (!fileName) return null
  return readMd(join(root, 'docs', 'oauth', `${fileName}.md`))
}

export function getWebhookDoc(slug) {
  const fileName = webhookFileMap[slug]
  if (!fileName) return null
  return readMd(join(root, 'docs', 'webhook events', `${fileName}.md`))
}

export function getMarketplaceDoc(slug) {
  const fileName = marketplaceFileMap[slug]
  if (!fileName) return null
  return readMd(join(root, 'docs', 'marketplace modules', `${fileName}.md`))
}

export function getApiSpecPath(slug) {
  const fileName = apiFileMap[slug]
  if (!fileName) return null
  const filePath = join(root, 'apps', `${fileName}.json`)
  return existsSync(filePath) ? filePath : null
}

export function apiSpecExists(slug) {
  return getApiSpecPath(slug) !== null
}

export function getApiSpecTitle(slug) {
  const titles = {
    'contacts': 'Contacts API', 'conversations': 'Conversations API',
    'calendars': 'Calendars API', 'opportunities': 'Opportunities API',
    'invoices': 'Invoices API', 'payments': 'Payments API',
    'users': 'Users API', 'workflows': 'Workflows API',
    'locations': 'Locations API', 'businesses': 'Businesses API',
    'forms': 'Forms API', 'surveys': 'Surveys API',
    'products': 'Products API', 'blogs': 'Blogs API',
    'funnels': 'Funnels API', 'social-media-posting': 'Social Planner API',
    'snapshots': 'Snapshots API', 'medias': 'Media Library API',
    'links': 'Trigger Links API', 'emails': 'Emails API',
    'marketplace': 'Marketplace API', 'saas-api': 'SaaS API',
    'custom-menus': 'Custom Menus API', 'custom-fields': 'Custom Fields API',
    'objects': 'Custom Objects API', 'associations': 'Associations API',
    'companies': 'Companies API', 'courses': 'Courses API',
    'email-isv': 'LC Email API', 'campaigns': 'Campaigns API',
    'oauth': 'OAuth API', 'ad-manager': 'Ad Manager API',
    'affiliate-manager': 'Affiliate Manager API', 'agent-studio': 'Agent Studio API',
    'brand-boards': 'Brand Boards API', 'conversation-ai': 'Conversation AI API',
    'knowledge-base': 'Knowledge Base API', 'phone-system': 'Phone System API',
    'proposals': 'Proposals API', 'store': 'Store API', 'voice-ai': 'Voice AI API',
  }
  return titles[slug] || `${slug} API`
}
