import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/marketing/header'
import { Footer } from '@/components/marketing/footer'
import { getBlogPosts } from '@/lib/blog'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | data-peek',
  description:
    'Technical insights, tutorials, and behind-the-scenes looks at building a modern database client.',
  openGraph: {
    title: 'Blog | data-peek',
    description:
      'Technical insights, tutorials, and behind-the-scenes looks at building a modern database client.',
    type: 'website',
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[--color-surface] border border-[--color-border] text-xs text-[--color-text-muted] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-accent] animate-pulse" />
                Engineering Blog
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="text-[--color-text-muted]">~/</span>blog
              </h1>
              <p className="text-lg text-[--color-text-secondary] max-w-2xl">
                Technical deep dives, tutorials, and behind-the-scenes looks at building data-peek.
                Learn how we build a fast, modern database client.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[--color-surface] border border-[--color-border] mb-6">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                <p className="text-[--color-text-secondary]">
                  We&apos;re working on some great content. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <article className="relative p-6 md:p-8 rounded-xl bg-[--color-surface] border border-[--color-border] hover:border-[--color-accent]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[--color-accent-glow]">
                      {/* Terminal-style header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: 'rgba(248, 113, 113, 0.6)' }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: 'rgba(251, 191, 36, 0.6)' }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: 'rgba(74, 222, 128, 0.6)' }}
                          />
                        </div>
                        <span className="text-xs text-[--color-text-muted] ml-2 font-mono">
                          {post.slug}.mdx
                        </span>
                      </div>

                      <h2
                        className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-[--color-accent] transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {post.title}
                      </h2>

                      <p className="text-[--color-text-secondary] mb-4 line-clamp-2">
                        {post.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[--color-text-muted]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readingTime}</span>
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{post.tags.slice(0, 3).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Read more indicator */}
                      <div className="absolute right-6 md:right-8 bottom-6 md:bottom-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-[--color-accent]" />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
