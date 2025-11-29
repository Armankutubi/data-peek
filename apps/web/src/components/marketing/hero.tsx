import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Github, Zap, Download, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Gradient Orbs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Early Bird + Open Source Badge */}
          <div className="animate-fade-in-up flex flex-wrap items-center justify-center gap-3 mb-8">
            <Badge variant="default" size="lg">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Early Bird — 70% off
            </Badge>
            <Badge variant="secondary" size="lg">
              <Github className="w-3.5 h-3.5 mr-1.5" />
              Open Source
            </Badge>
          </div>

          {/* Main Headline */}
          <h1
            className="animate-fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.9] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Peek at your data.
            <br />
            <span className="gradient-text">Fast.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in-up delay-200 text-lg md:text-xl text-[--color-text-secondary] max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A lightning-fast PostgreSQL client for developers who value simplicity.
            Open source, free for personal use.
          </p>

          {/* Terminal-style feature highlight */}
          <div
            className="animate-fade-in-up delay-300 mb-10 px-6 py-3 rounded-full bg-[--color-surface] border border-[--color-border] inline-flex items-center gap-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-[--color-warning]" />
              <span className="text-[--color-text-muted]">&lt; 2s startup</span>
            </span>
            <span className="w-px h-4 bg-[--color-border]" />
            <span className="flex items-center gap-2 text-sm">
              <span className="text-[--color-text-muted]">keyboard-first</span>
            </span>
            <span className="w-px h-4 bg-[--color-border]" />
            <span className="flex items-center gap-2 text-sm">
              <span className="text-[--color-text-muted]">all features free</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/download">
                <Download className="w-4 h-4" />
                Download Free
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#pricing">
                Get Pro — $29
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Platform Support */}
          <p
            className="animate-fade-in-up delay-500 mt-6 text-sm text-[--color-text-muted]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            macOS · Windows · Linux
          </p>

          {/* Hero Screenshot */}
          <div className="animate-scale-in delay-600 mt-16 w-full max-w-5xl">
            <div className="relative">
              {/* Window Chrome */}
              <div className="absolute -top-px -left-px -right-px h-10 rounded-t-2xl bg-[--color-surface-elevated] border border-[--color-border] border-b-0 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span
                  className="ml-4 text-xs text-[--color-text-muted]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  data-peek
                </span>
              </div>

              {/* Screenshot Placeholder */}
              <div className="screenshot-placeholder mt-10 min-h-[400px] md:min-h-[500px] rounded-2xl rounded-t-none border-t-0 shadow-2xl shadow-black/50">
                <div className="flex flex-col items-center gap-4 z-10">
                  <div
                    className="w-16 h-16 rounded-2xl bg-[--color-accent]/10 border border-[--color-accent]/20 flex items-center justify-center"
                  >
                    <span className="text-2xl">📸</span>
                  </div>
                  <span>screenshot_hero.png</span>
                  <span className="text-xs text-[--color-text-muted]">1920 × 1080 recommended</span>
                </div>
              </div>

              {/* Glow Effect */}
              <div
                className="absolute -inset-4 -z-10 rounded-3xl opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at center top, var(--color-accent-glow) 0%, transparent 60%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
