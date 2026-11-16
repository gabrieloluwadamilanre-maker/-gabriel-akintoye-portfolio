import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { m } from 'motion/react';
import { PROFILE } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';
import { RevealText } from './RevealText';
import { TiltCard } from './TiltCard';

const CONTACT_FLOATING_WORDS: FloatingWordItem[] = [
  {
    text: 'CREATE',
    depth: 26,
    className:
      'top-8 right-[6%] text-5xl sm:text-6xl text-[#3B82F6]/[0.06] drop-shadow-[0_0_16px_rgba(59,130,246,0.16)]',
  },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-[#0B1220]"
    >
      <FloatingTypography items={CONTACT_FLOATING_WORDS} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <m.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-[#3B82F6]"
            >
              Contact
            </m.p>
            <RevealText
              as="h2"
              id="contact-heading"
              text="Let's build something together."
              className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl"
            />
            <m.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-sm leading-relaxed text-[#A1AAB8] sm:text-base"
            >
              I am open to freelance website projects, collaborative builds, and entry-level or internship opportunities. Reach out directly by email or WhatsApp.
            </m.p>
          </div>

          {/* Right Column: Email & WhatsApp Glassmorphic Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email Card */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                maxTilt={4}
                className="h-full rounded-2xl border border-[#1E3A5F]/65 bg-[#111C30]/95 md:bg-[#111C30]/80 md:backdrop-blur-md p-6 hover:border-[#3B82F6]/65 hover:shadow-[0_12px_32px_rgba(59,130,246,0.16)]"
              >
                <div className="relative z-20 flex h-full flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E3A5F]/80 bg-[#0B1220]/80 text-[#3B82F6]">
                      <Mail className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                        Email
                      </h3>
                      <a
                        href={`mailto:${PROFILE.email}`}
                        className="block break-all text-sm text-[#E2E8F0] hover:text-[#60A5FA] transition-colors"
                      >
                        {PROFILE.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#1D4ED8] transition-all whitespace-nowrap"
                    >
                      <span>Send Email</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label={copied ? 'Email address copied' : 'Copy email address'}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-[#1E3A5F]/80 bg-[#0B1220]/80 px-3.5 py-2.5 text-xs font-medium text-[#F8FAFC] hover:border-[#3B82F6]/70 transition-colors whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#A1AAB8]" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <span role="status" aria-live="polite" className="sr-only">
                      {copied ? 'Email address copied to clipboard.' : ''}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </m.div>

            {/* WhatsApp Card */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                maxTilt={4}
                className="h-full rounded-2xl border border-[#1E3A5F]/65 bg-[#111C30]/95 md:bg-[#111C30]/80 md:backdrop-blur-md p-6 hover:border-[#3B82F6]/65 hover:shadow-[0_12px_32px_rgba(59,130,246,0.16)]"
              >
                <div className="relative z-20 flex h-full flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E3A5F]/80 bg-[#0B1220]/80 text-[#3B82F6]">
                      <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                        WhatsApp
                      </h3>
                      <a
                        href={PROFILE.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-mono text-sm tabular-nums text-[#E2E8F0] hover:text-[#60A5FA] transition-colors"
                      >
                        {PROFILE.whatsappDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={PROFILE.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#1E3A5F]/80 bg-[#0B1220]/85 px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] hover:border-[#3B82F6] hover:text-[#60A5FA] transition-all whitespace-nowrap"
                    >
                      <span>Chat on WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
