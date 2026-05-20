import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const sidebar = [
  {
    "label": "Getting Started",
    "items": [
      {
        "label": "Introduction",
        "slug": "getting-started"
      }
    ]
  },
  {
    "label": "OAuth 2.0",
    "collapsed": false,
    "items": [
      {
        "label": "Overview",
        "slug": "oauth/overview"
      },
      {
        "label": "Scopes",
        "slug": "oauth/scopes"
      },
      {
        "label": "Authorization",
        "slug": "oauth/authorization"
      },
      {
        "label": "External Billing",
        "slug": "oauth/billing"
      },
      {
        "label": "External Authentication",
        "slug": "oauth/externalauthentication"
      },
      {
        "label": "Webhook Authentication",
        "slug": "oauth/webhookauthentication"
      },
      {
        "label": "FAQs",
        "slug": "oauth/faqs"
      }
    ]
  },
  {
    "label": "API Reference",
    "collapsed": false,
    "items": [
      {
        "label": "All APIs",
        "slug": "api-reference/overview"
      },
      {
        "label": "Ad Manager API",
        "slug": "api-reference/ad-manager"
      },
      {
        "label": "Affiliate Manager API",
        "slug": "api-reference/affiliate-manager"
      },
      {
        "label": "Agent Studio API",
        "slug": "api-reference/agent-studio"
      },
      {
        "label": "Associations API",
        "slug": "api-reference/associations"
      },
      {
        "label": "Blogs API",
        "slug": "api-reference/blogs"
      },
      {
        "label": "Brand Boards API",
        "slug": "api-reference/brand-boards"
      },
      {
        "label": "Businesses API",
        "slug": "api-reference/businesses"
      },
      {
        "label": "Calendars API",
        "slug": "api-reference/calendars"
      },
      {
        "label": "Campaigns API",
        "slug": "api-reference/campaigns"
      },
      {
        "label": "Companies API",
        "slug": "api-reference/companies"
      },
      {
        "label": "Contacts API",
        "slug": "api-reference/contacts"
      },
      {
        "label": "Conversation AI API",
        "slug": "api-reference/conversation-ai"
      },
      {
        "label": "Conversations API",
        "slug": "api-reference/conversations"
      },
      {
        "label": "Courses API",
        "slug": "api-reference/courses"
      },
      {
        "label": "Custom Fields API",
        "slug": "api-reference/custom-fields"
      },
      {
        "label": "Custom Menus API",
        "slug": "api-reference/custom-menus"
      },
      {
        "label": "LC Email API",
        "slug": "api-reference/email-isv"
      },
      {
        "label": "Emails API",
        "slug": "api-reference/emails"
      },
      {
        "label": "Forms API",
        "slug": "api-reference/forms"
      },
      {
        "label": "Funnels API",
        "slug": "api-reference/funnels"
      },
      {
        "label": "Invoices API",
        "slug": "api-reference/invoices"
      },
      {
        "label": "Knowledge Base API",
        "slug": "api-reference/knowledge-base"
      },
      {
        "label": "Trigger Links API",
        "slug": "api-reference/links"
      },
      {
        "label": "Sub-Accounts API",
        "slug": "api-reference/locations"
      },
      {
        "label": "Marketplace API",
        "slug": "api-reference/marketplace"
      },
      {
        "label": "Media Library API",
        "slug": "api-reference/medias"
      },
      {
        "label": "OAuth API",
        "slug": "api-reference/oauth"
      },
      {
        "label": "Custom Objects API",
        "slug": "api-reference/objects"
      },
      {
        "label": "Opportunities API",
        "slug": "api-reference/opportunities"
      },
      {
        "label": "Payments API",
        "slug": "api-reference/payments"
      },
      {
        "label": "Phone System API",
        "slug": "api-reference/phone-system"
      },
      {
        "label": "Products API",
        "slug": "api-reference/products"
      },
      {
        "label": "Proposals & Estimates API",
        "slug": "api-reference/proposals"
      },
      {
        "label": "SaaS API",
        "slug": "api-reference/saas-api"
      },
      {
        "label": "Snapshots API",
        "slug": "api-reference/snapshots"
      },
      {
        "label": "Social Planner API",
        "slug": "api-reference/social-media-posting"
      },
      {
        "label": "Store API",
        "slug": "api-reference/store"
      },
      {
        "label": "Surveys API",
        "slug": "api-reference/surveys"
      },
      {
        "label": "Users API",
        "slug": "api-reference/users"
      },
      {
        "label": "Voice AI API",
        "slug": "api-reference/voice-ai"
      },
      {
        "label": "Workflows API",
        "slug": "api-reference/workflows"
      }
    ]
  },
  {
    "label": "Webhook Events",
    "collapsed": true,
    "items": [
      {
        "label": "Overview",
        "slug": "webhooks/overview"
      },
      {
        "label": "AppointmentCreate",
        "slug": "webhooks/appointmentcreate"
      },
      {
        "label": "AppointmentDelete",
        "slug": "webhooks/appointmentdelete"
      },
      {
        "label": "AppointmentUpdate",
        "slug": "webhooks/appointmentupdate"
      },
      {
        "label": "AppInstall",
        "slug": "webhooks/appinstall"
      },
      {
        "label": "AppUninstall",
        "slug": "webhooks/appuninstall"
      },
      {
        "label": "ExternalAuthConnected",
        "slug": "webhooks/externalauthconnected"
      },
      {
        "label": "CampaignStatusUpdate",
        "slug": "webhooks/campaignstatusupdate"
      },
      {
        "label": "ContactCreate",
        "slug": "webhooks/contactcreate"
      },
      {
        "label": "ContactDelete",
        "slug": "webhooks/contactdelete"
      },
      {
        "label": "ContactDndUpdate",
        "slug": "webhooks/contactdndupdate"
      },
      {
        "label": "ContactTagUpdate",
        "slug": "webhooks/contacttagupdate"
      },
      {
        "label": "ContactUpdate",
        "slug": "webhooks/contactupdate"
      },
      {
        "label": "Conversation Provider Outbound Webhook",
        "slug": "webhooks/provideroutboundmessage"
      },
      {
        "label": "Conversation Unread Webhook",
        "slug": "webhooks/conversationunreadwebhook"
      },
      {
        "label": "InboundMessage",
        "slug": "webhooks/inboundmessage"
      },
      {
        "label": "InvoiceCreate",
        "slug": "webhooks/invoicecreate"
      },
      {
        "label": "InvoiceSent",
        "slug": "webhooks/invoicesent"
      },
      {
        "label": "InvoiceVoid",
        "slug": "webhooks/invoicevoid"
      },
      {
        "label": "InvoicePaid",
        "slug": "webhooks/invoicepaid"
      },
      {
        "label": "InvoicePartiallyPaid",
        "slug": "webhooks/invoicepartiallypaid"
      },
      {
        "label": "InvoiceDelete",
        "slug": "webhooks/invoicedelete"
      },
      {
        "label": "InvoiceUpdate",
        "slug": "webhooks/invoiceupdate"
      },
      {
        "label": "LCEmailStats",
        "slug": "webhooks/lcemailstats"
      },
      {
        "label": "LocationCreate",
        "slug": "webhooks/locationcreate"
      },
      {
        "label": "LocationUpdate",
        "slug": "webhooks/locationupdate"
      },
      {
        "label": "NoteCreate",
        "slug": "webhooks/notecreate"
      },
      {
        "label": "NoteDelete",
        "slug": "webhooks/notedelete"
      },
      {
        "label": "NoteUpdate",
        "slug": "webhooks/noteupdate"
      },
      {
        "label": "OpportunityAssignedToUpdate",
        "slug": "webhooks/opportunityassignedtoupdate"
      },
      {
        "label": "OpportunityCreate",
        "slug": "webhooks/opportunitycreate"
      },
      {
        "label": "OpportunityDelete",
        "slug": "webhooks/opportunitydelete"
      },
      {
        "label": "OpportunityMonetaryValueUpdate",
        "slug": "webhooks/opportunitymonetaryvalueupdate"
      },
      {
        "label": "OpportunityStageUpdate",
        "slug": "webhooks/opportunitystageupdate"
      },
      {
        "label": "OpportunityStatusUpdate",
        "slug": "webhooks/opportunitystatusupdate"
      },
      {
        "label": "OpportunityUpdate",
        "slug": "webhooks/opportunityupdate"
      },
      {
        "label": "OrderCreate",
        "slug": "webhooks/ordercreate"
      },
      {
        "label": "OrderStatusUpdate",
        "slug": "webhooks/orderstatusupdate"
      },
      {
        "label": "OutboundMessage",
        "slug": "webhooks/outboundmessage"
      },
      {
        "label": "PlanChange",
        "slug": "webhooks/planchange"
      },
      {
        "label": "PriceCreate",
        "slug": "webhooks/pricecreate"
      },
      {
        "label": "PriceUpdate",
        "slug": "webhooks/priceupdate"
      },
      {
        "label": "PriceDelete",
        "slug": "webhooks/pricedelete"
      },
      {
        "label": "ProductCreate",
        "slug": "webhooks/productcreate"
      },
      {
        "label": "ProductUpdate",
        "slug": "webhooks/productupdate"
      },
      {
        "label": "ProductDelete",
        "slug": "webhooks/productdelete"
      },
      {
        "label": "TaskComplete",
        "slug": "webhooks/taskcomplete"
      },
      {
        "label": "TaskCreate",
        "slug": "webhooks/taskcreate"
      },
      {
        "label": "TaskDelete",
        "slug": "webhooks/taskdelete"
      },
      {
        "label": "UserCreate",
        "slug": "webhooks/usercreate"
      },
      {
        "label": "ObjectSchemaCreate",
        "slug": "webhooks/objectschemacreate"
      },
      {
        "label": "ObjectSchemaUpdate",
        "slug": "webhooks/objectschemaupdate"
      },
      {
        "label": "RecordCreate",
        "slug": "webhooks/recordcreate"
      },
      {
        "label": "RecordUpdate",
        "slug": "webhooks/recordupdate"
      },
      {
        "label": "RecordDelete",
        "slug": "webhooks/recorddelete"
      },
      {
        "label": "RelationCreate",
        "slug": "webhooks/relationcreate"
      },
      {
        "label": "RelationDelete",
        "slug": "webhooks/relationdelete"
      },
      {
        "label": "AssociationUpdate",
        "slug": "webhooks/associationupdate"
      },
      {
        "label": "AssociationCreate",
        "slug": "webhooks/associationcreate"
      },
      {
        "label": "AssociationDelete",
        "slug": "webhooks/associationdelete"
      }
    ]
  },
  {
    "label": "Marketplace Modules",
    "collapsed": true,
    "items": [
      {
        "label": "User Context (SSO)",
        "slug": "marketplace-modules/shared-secret-customjs-custompages"
      },
      {
        "label": "Custom JavaScript",
        "slug": "marketplace-modules/customjs"
      },
      {
        "label": "Conversation Providers",
        "slug": "marketplace-modules/conversationproviders"
      }
    ]
  },
  {
    "label": "Reference",
    "collapsed": true,
    "items": [
      {
        "label": "Country List",
        "slug": "country-reference/country"
      },
      {
        "label": "API Attribution",
        "slug": "legal/api-attribution"
      }
    ]
  }
];

export default defineConfig({
  output: 'static',
  integrations: [
    starlight({
      title: 'Kleegr Developers',
      description: 'Developer documentation for building integrations and connected workflows with Kleegr CRM.',
      favicon: '/favicon.svg',
      logo: { src: './src/assets/logo.svg', replacesTitle: false },
      customCss: ['./src/styles/custom.css'],
      lastUpdated: false,
      pagination: true,
      social: {},
      sidebar,
      components: { Footer: './src/components/Footer.astro' },
    }),
  ],
});
