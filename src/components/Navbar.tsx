import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NAV_LINKS, PROFILE } from '@/src/data/portfolio';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#home');

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track currently visible section for active nav indicator
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-38% 0px -52% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    observers.push(observer);

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1220]/85 backdrop-blur-md border-b border-[#1E3A5F]/50 shadow-[0_8px_30px_rgba(2,6,23,0.45)]'
          : 'bg-[#0B1220]/65 backdrop-blur-sm border-b border-[#1E293B]/60'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={() => handleNavClick('#home')}
          className="font-display text-lg font-semibold tracking-tight text-[#F8FAFC] hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0"
        >
          {PROFILE.name}
        </a>

        {/* Zone 2: Concise single-line nav links with active indicator */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(link.href)}
                className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#F8FAFC]'
                    : 'text-[#A1AAB8] hover:text-[#F8FAFC]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.85)]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (desktop) + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            className="hidden md:inline-flex items-center justify-center min-h-[40px] rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#2563EB] hover:shadow-[0_0_26px_rgba(59,130,246,0.55)] transition-all whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-[#1E3A5F]/60 bg-[#111C30]/85 text-[#F8FAFC] hover:border-[#3B82F6]/70 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-[#1E3A5F]/50 bg-[#0B1220]/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 sm:px-6">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handleNavClick(link.href)}
                        className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-[#111C30] text-[#F8FAFC] border border-[#3B82F6]/40'
                            : 'text-[#A1AAB8] hover:bg-[#111C30]/60 hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="text-xs font-mono text-[#3B82F6]">Active</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 pt-3 border-t border-[#1E293B]">
                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#2563EB] transition-colors"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
