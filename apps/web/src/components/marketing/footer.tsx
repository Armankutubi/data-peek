import Link from 'next/link'
import { Database, Github, Twitter } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Download', href: '/download' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Support', href: '/support' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'License', href: '/license' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-[--color-border] bg-[--color-surface]/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[--color-accent] flex items-center justify-center">
                <Database className="w-4 h-4 text-[--color-background]" />
              </div>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                data-peek
              </span>
            </Link>
            <p
              className="text-sm text-[--color-text-secondary] max-w-xs mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              A fast, beautiful PostgreSQL client for developers who value simplicity.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/Rohithgilla12/data-peek"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[--color-surface] border border-[--color-border] flex items-center justify-center text-[--color-text-muted] hover:text-[--color-text-primary] hover:border-[--color-text-muted] transition-colors"
              >
                <Github className="w-4 h-4" />
              </Link>
              <Link
                href="https://x.com/gillarohith"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[--color-surface] border border-[--color-border] flex items-center justify-center text-[--color-text-muted] hover:text-[--color-text-primary] hover:border-[--color-text-muted] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs uppercase tracking-[0.15em] text-[--color-text-muted] mb-4"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[--color-border] flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-sm text-[--color-text-muted]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © {new Date().getFullYear()} data-peek. All rights reserved.
          </p>
          <p className="text-sm text-[--color-text-muted]">
            Made with{' '}
            <span className="text-[--color-error]">♥</span> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
