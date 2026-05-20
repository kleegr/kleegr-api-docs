'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/lib/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="docs-sidebar">
      {navigation.map((section) => (
        <div key={section.title} className="sidebar-section">
          <div className="sidebar-title">{section.title}</div>
          {section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  )
}
