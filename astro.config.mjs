import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'static',
  integrations: [
    starlight({
      title: 'Kleegr Developers',
      description: 'Developer documentation for building integrations, automations, and connected workflows with Kleegr CRM.',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      customCss: ['./src/styles/custom.css'],
      lastUpdated: false,
      pagination: true,
      social: {},
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started' },
          ],
        },
        {
          label: 'OAuth 2.0',
          items: [
            { label: 'Overview', slug: 'oauth/overview' },
            { label: 'Authorization', slug: 'oauth/authorization' },
            { label: 'Scopes', slug: 'oauth/scopes' },
            { label: 'Webhook Authentication', slug: 'oauth/webhook-authentication' },
            { label: 'External Billing', slug: 'oauth/billing' },
            { label: 'FAQs', slug: 'oauth/faqs' },
          ],
        },
        {
          label: 'Webhook Events',
          items: [
            { label: 'Overview', slug: 'webhooks/overview' },
            { label: 'Contact Events', slug: 'webhooks/contact-events' },
            { label: 'ContactCreate', slug: 'webhooks/contact-create' },
            { label: 'ContactUpdate', slug: 'webhooks/contact-update' },
            { label: 'ContactDelete', slug: 'webhooks/contact-delete' },
            { label: 'InboundMessage', slug: 'webhooks/inbound-message' },
            { label: 'OutboundMessage', slug: 'webhooks/outbound-message' },
            { label: 'AppointmentCreate', slug: 'webhooks/appointment-create' },
            { label: 'AppointmentUpdate', slug: 'webhooks/appointment-update' },
            { label: 'AppointmentDelete', slug: 'webhooks/appointment-delete' },
            { label: 'InvoiceCreate', slug: 'webhooks/invoice-create' },
            { label: 'InvoicePaid', slug: 'webhooks/invoice-paid' },
            { label: 'OpportunityCreate', slug: 'webhooks/opportunity-create' },
            { label: 'OpportunityUpdate', slug: 'webhooks/opportunity-update' },
            { label: 'OrderCreate', slug: 'webhooks/order-create' },
            { label: 'AppInstall', slug: 'webhooks/app-install' },
            { label: 'UserCreate', slug: 'webhooks/user-create' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', slug: 'api-reference/overview' },
            { label: 'Contacts', slug: 'api-reference/contacts' },
            { label: 'Conversations', slug: 'api-reference/conversations' },
            { label: 'Calendars', slug: 'api-reference/calendars' },
            { label: 'Opportunities', slug: 'api-reference/opportunities' },
            { label: 'Invoices', slug: 'api-reference/invoices' },
            { label: 'Payments', slug: 'api-reference/payments' },
            { label: 'Users', slug: 'api-reference/users' },
            { label: 'Workflows', slug: 'api-reference/workflows' },
            { label: 'Businesses', slug: 'api-reference/businesses' },
            { label: 'Campaigns', slug: 'api-reference/campaigns' },
            { label: 'Companies', slug: 'api-reference/companies' },
            { label: 'Forms', slug: 'api-reference/forms' },
            { label: 'Media Library', slug: 'api-reference/medias' },
            { label: 'Snapshots', slug: 'api-reference/snapshots' },
            { label: 'Social Planner', slug: 'api-reference/social-media-posting' },
            { label: 'Blogs', slug: 'api-reference/blogs' },
            { label: 'Funnels', slug: 'api-reference/funnels' },
            { label: 'Courses', slug: 'api-reference/courses' },
            { label: 'Surveys', slug: 'api-reference/surveys' },
            { label: 'Sub-Accounts', slug: 'api-reference/locations' },
          ],
        },
        {
          label: 'Legal',
          items: [
            { label: 'API Attribution', slug: 'legal/api-attribution' },
          ],
        },
      ],
      components: {
        Footer: './src/components/Footer.astro',
      },
    }),
  ],
});
