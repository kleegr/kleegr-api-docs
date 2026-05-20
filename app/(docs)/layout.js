import Nav from '@/components/Nav'
import Sidebar from '@/components/Sidebar'

export default function DocsLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="docs-shell">
        <Sidebar />
        <main className="docs-main">
          {children}
        </main>
      </div>
    </>
  )
}
