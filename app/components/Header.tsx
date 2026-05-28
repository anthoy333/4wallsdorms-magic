"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  if (pathname === "/room-504") return null

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-header-logo" onClick={() => setMenuOpen(false)}>
          4WallsDorms
        </Link>

        {/* Desktop nav */}
        <nav className="site-header-links">
          <Link href="/dorms/su/suffolk-university/boston/miller-hall/Nathan-R.-Miller-Hall" className="site-header-link">
            Miller Hall
          </Link>
        </nav>

        <Link href="/upload-dorm" className="site-header-cta site-header-cta--desktop">
          Add Your Dorm Videos
        </Link>

        {/* Mobile hamburger */}
        <button
          className="site-header-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <line x1="3" y1="5"  x2="19" y2="5"  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="3" y1="17" x2="19" y2="17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="site-header-mobile-menu">
          <Link href="/dorms/su/suffolk-university/boston/miller-hall/Nathan-R.-Miller-Hall" className="site-header-mobile-link" onClick={() => setMenuOpen(false)}>
            Miller Hall
          </Link>
          <Link href="/upload-dorm" className="site-header-cta site-header-cta--mobile" onClick={() => setMenuOpen(false)}>
            Add Your Dorm Videos
          </Link>
        </div>
      )}
    </header>
  )
}
