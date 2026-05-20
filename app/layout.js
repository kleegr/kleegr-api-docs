import './globals.css'

export const metadata = {
  title: { default: 'Kleegr Developer Docs', template: '%s — Kleegr Developers' },
  description: 'Developer documentation for building integrations with Kleegr-powered CRM accounts.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
