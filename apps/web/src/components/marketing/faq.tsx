'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Is data-peek really free?',
    answer:
      'Yes! data-peek is free for personal use with all features unlocked. No credit card required, no time limits, no feature restrictions. A license is only required if you use it for commercial purposes at a for-profit company with 2+ people.',
  },
  {
    question: 'What counts as commercial use?',
    answer:
      'Commercial use means using data-peek for work-related activities in a for-profit organization of 2+ people. This includes developers at startups/companies, freelancers billing clients, and agencies doing client work. Solo founders (company of one) are free!',
  },
  {
    question: 'Is data-peek open source?',
    answer:
      'Yes! The source code is MIT licensed on GitHub. You can view, modify, fork, and build it yourself for any purpose. Pre-built binaries require a license for commercial use — this is how we sustain development.',
  },
  {
    question: 'What does "perpetual fallback" mean?',
    answer:
      'When you buy a Pro license ($29/year), you get 1 year of updates. If you don\'t renew, you keep your current version forever — it doesn\'t stop working. You just won\'t receive future updates. Renew anytime to get the latest.',
  },
  {
    question: "I'm a student. Can I use it for free?",
    answer:
      'Absolutely! Students and educators can use data-peek for free, even for school projects. Just reach out on X (@gillarohith) or email gillarohith1@gmail.com and we\'ll hook you up with a free license. Learning should never have barriers.',
  },
  {
    question: 'How does the honor system work?',
    answer:
      'We trust you. There\'s no DRM, no aggressive license checks, no "you\'ve been logged out" surprises. If you\'re using it commercially, we ask that you pay for a license. Inspired by Yaak and other sustainable indie software.',
  },
  {
    question: 'How many devices can I use?',
    answer:
      'Each license includes 3 device activations. Use it on your work laptop, home computer, and one more device. Need more? Just reach out.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. data-peek runs entirely on your machine. All queries go directly to your database — we never see your data. Connection credentials are encrypted locally. No telemetry, no analytics, no tracking.',
  },
  {
    question: 'What databases are supported?',
    answer:
      'Currently PostgreSQL and MySQL. We\'re laser-focused on making the best database experience possible. SQLite and more databases are planned for future releases.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Yes, 30-day money-back guarantee, no questions asked. If data-peek isn\'t right for you, just email us.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[--color-surface]/30 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p
            className="text-xs uppercase tracking-[0.2em] text-[--color-accent] mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            FAQ
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 sm:mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Questions? Answers.
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg sm:rounded-xl border border-[--color-border] overflow-hidden bg-[--color-surface]/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[--color-surface] transition-colors"
              >
                <span
                  className="text-sm sm:text-base font-medium pr-3 sm:pr-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-[--color-text-muted] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p
                  className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[--color-text-secondary] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
