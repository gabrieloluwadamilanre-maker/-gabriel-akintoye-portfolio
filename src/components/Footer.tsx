import { NAV_LINKS, PROFILE } from '@/src/data/portfolio';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1E293B]/80 bg-[#0B1220]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-1">
          <a
            href="#home"
            className="font-display text-base font-semibold text-[#F8FAFC] hover:text-[#60A5FA] transition-colors"
          >
            {PROFILE.name}
          </a>
          <p className="text-xs text-[#A1AAB8]">
            &copy; {currentYear} {PROFILE.name}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#A1AAB8] hover:text-[#F8FAFC] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
