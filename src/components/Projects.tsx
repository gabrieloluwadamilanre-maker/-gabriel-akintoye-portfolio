import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Expand, FolderPlus, X } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { FEATURED_PROJECTS, type ProjectItem } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';
import { ImageWithFallback } from './ImageWithFallback';
import { RevealText } from './RevealText';
import { TiltCard } from './TiltCard';

const PROJECTS_FLOATING_WORDS: FloatingWordItem[] = [
  {
    text: 'INNOVATE',
    depth: 34,
    className:
      'top-8 right-[4%] text-4xl sm:text-6xl lg:text-7xl text-[#3B82F6]/[0.06] drop-shadow-[0_0_16px_rgba(59,130,246,0.16)]',
  },
  {
    text: 'CODE',
    depth: 24,
    reverse: true,
    hideOnMobile: true,
    className:
      'bottom-10 left-[3%] text-5xl lg:text-6xl text-[#60A5FA]/[0.05] blur-[0.4px]',
  },
];

export function Projects() {
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openPreview = (project: ProjectItem, triggerEl: HTMLElement) => {
    lastTriggerRef.current = triggerEl;
    setPreviewProject(project);
  };

  const closePreview = () => {
    setPreviewProject(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  };

  useEffect(() => {
    if (!previewProject) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frameId = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePreview();
        return;
      }

      if (event.key === 'Tab') {
        const dialogEl = modalRef.current;
        if (!dialogEl) return;

        const focusable = Array.from(
          dialogEl.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!activeEl || !dialogEl.contains(activeEl) || activeEl === firstEl) {
            event.preventDefault();
            lastEl.focus();
          }
        } else {
          if (!activeEl || !dialogEl.contains(activeEl) || activeEl === lastEl) {
            event.preventDefault();
            firstEl.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [previewProject]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative scroll-mt-16 overflow-hidden border-b border-[#1E293B]/80 bg-[#0E1729]"
    >
      <FloatingTypography items={PROJECTS_FLOATING_WORDS} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="space-y-3 max-w-2xl">
          <m.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-[#3B82F6]"
          >
            Featured Projects
          </m.p>
          <RevealText
            as="h2"
            id="projects-heading"
            text="Selected work built for the web."
            className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl"
          />
          <m.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-sm leading-relaxed text-[#A1AAB8] sm:text-base"
          >
            Practical applications focused on responsive layout, clean user journeys, and reliable front-end implementation.
          </m.p>
        </div>

        {/* Projects Bento / Grid — Structured to add future projects cleanly */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {FEATURED_PROJECTS.map((project, idx) => (
            <m.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-8"
            >
              <TiltCard
                maxTilt={4}
                glowColor="rgba(59, 130, 246, 0.2)"
                className="h-full overflow-hidden rounded-2xl border border-[#1E3A5F]/65 bg-[#111C30]/95 md:bg-[#111C30]/85 md:backdrop-blur-md shadow-[0_20px_50px_rgba(2,6,23,0.45)] hover:border-[#3B82F6]/70"
              >
                <article className="relative z-20 flex h-full flex-col">
                  {/* Project Media Preview */}
                  <div className="group relative aspect-video w-full overflow-hidden border-b border-[#1E3A5F]/60 bg-[#0B1220]">
                    <ImageWithFallback
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      fallbackTitle={project.title}
                      width={project.imageWidth}
                      height={project.imageHeight}
                      containerClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111C30]/85 via-transparent to-transparent"
                    />
                    <button
                      type="button"
                      onClick={(e) => openPreview(project, e.currentTarget)}
                      aria-label={`Inspect ${project.title} preview image`}
                      className="absolute right-4 bottom-4 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#1E3A5F]/80 bg-[#0B1220]/90 md:bg-[#0B1220]/85 px-3.5 py-2 text-xs font-medium text-[#F8FAFC] md:backdrop-blur-md hover:border-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                    >
                      <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Project Details */}
                  <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-[#60A5FA]">
                          {project.subtitle}
                        </p>
                        <h3 className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC]">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed text-[#E2E8F0] sm:text-base max-w-2xl">
                        {project.description}
                      </p>

                      {/* Unboxed Technologies & Highlights Metadata */}
                      <div className="space-y-2 pt-3 border-t border-[#1E3A5F]/50">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1AAB8] sm:text-sm">
                          <span className="font-medium text-[#F8FAFC]">Stack:</span>
                          {project.technologies.map((tech, index) => (
                            <span key={tech} className="inline-flex items-center gap-2">
                              {index > 0 && (
                                <span aria-hidden="true" className="text-[#475569]">
                                  ·
                                </span>
                              )}
                              <span>{tech}</span>
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1AAB8] sm:text-sm">
                          <span className="font-medium text-[#F8FAFC]">Includes:</span>
                          {project.highlights.map((item, index) => (
                            <span key={item} className="inline-flex items-center gap-2">
                              {index > 0 && (
                                <span aria-hidden="true" className="text-[#475569]">
                                  ·
                                </span>
                              )}
                              <span>{item}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#1D4ED8] hover:shadow-[0_0_28px_rgba(59,130,246,0.55)] transition-all whitespace-nowrap shrink-0"
                      >
                        <span>Visit Live Website</span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </a>

                      <span className="font-mono text-xs text-[#A1AAB8] truncate max-w-full sm:max-w-[260px]">
                        pixels-to-living-layout.vercel.app
                      </span>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </m.div>
          ))}

          {/* Reserved Slot for Future Projects */}
          <m.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Upcoming projects placeholder"
            className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-dashed border-[#1E3A5F]/80 bg-[#111C30]/85 md:bg-[#111C30]/55 md:backdrop-blur-md p-6 sm:p-8"
          >
            <div className="space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1E3A5F]/80 bg-[#0B1220]/80 text-[#3B82F6]">
                <FolderPlus className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#60A5FA]">
                  Upcoming Work
                </p>
                <h3 className="font-display text-xl font-semibold text-[#F8FAFC]">
                  More projects in progress
                </h3>
                <p className="text-sm leading-relaxed text-[#A1AAB8]">
                  I am actively building new web applications as part of my Computer Science studies and front-end practice. Additional completed work will be showcased here soon.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1E3A5F]/50">
              <a
                href="#contact"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
              >
                <span>Collaborate on a project</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </m.aside>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <AnimatePresence>
        {previewProject && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePreview}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/95 md:bg-[#0B1220]/90 p-4 md:backdrop-blur-md sm:p-6"
          >
            <m.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#1E3A5F]/80 bg-[#111C30] shadow-[0_24px_70px_rgba(2,6,23,0.75)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[#1E3A5F]/60 px-5 py-4">
                <div>
                  <h3
                    id="lightbox-title"
                    className="font-display text-lg font-semibold text-[#F8FAFC]"
                  >
                    {previewProject.title}
                  </h3>
                  <p className="text-xs text-[#A1AAB8]">{previewProject.subtitle}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closePreview}
                  aria-label="Close project preview"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#1E3A5F]/70 bg-[#0B1220] text-[#F8FAFC] hover:border-[#3B82F6] transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="aspect-video w-full bg-[#0B1220]">
                <ImageWithFallback
                  src={previewProject.imageUrl}
                  alt={previewProject.imageAlt}
                  fallbackTitle={previewProject.title}
                  width={previewProject.imageWidth}
                  height={previewProject.imageHeight}
                  containerClassName="h-full w-full"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-[#1E3A5F]/60">
                <p className="text-xs text-[#A1AAB8] sm:text-sm">
                  {previewProject.technologies.join(' · ')}
                </p>
                <a
                  href={previewProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-[#F8FAFC] hover:bg-[#1D4ED8] transition-colors sm:text-sm"
                >
                  <span>Visit Live Website</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
