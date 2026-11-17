import { useRef, useState, type KeyboardEvent } from 'react';
import { m } from 'motion/react';
import { SKILL_CATEGORIES, SKILLS, type SkillCategory } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';
import { RevealText } from './RevealText';
import { TiltCard } from './TiltCard';

const SKILLS_FLOATING_WORDS: FloatingWordItem[] = [
  {
    text: 'DEVELOP',
    depth: 30,
    className:
      'top-10 right-[4%] text-5xl sm:text-7xl text-[#3B82F6]/[0.06] drop-shadow-[0_0_16px_rgba(59,130,246,0.16)]',
  },
  {
    text: 'A',
    depth: 22,
    reverse: true,
    hideOnMobile: true,
    className:
      'bottom-12 left-[2%] text-6xl text-[#60A5FA]/[0.05] blur-[0.4px]',
  },
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredSkills =
    activeCategory === 'all'
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === activeCategory);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = SKILL_CATEGORIES.length;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % count;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + count) % count;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveCategory(SKILL_CATEGORIES[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative scroll-mt-16 overflow-hidden border-b border-[#1E293B]/80 bg-[#0B1220]"
    >
      <FloatingTypography items={SKILLS_FLOATING_WORDS} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header + Interactive Filter Tabs */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-xl">
            <m.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-[#3B82F6]"
            >
              Skills &amp; Toolkit
            </m.p>
            <RevealText
              as="h2"
              id="skills-heading"
              text="Technologies I am developing and working with."
              className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl"
            />
            <m.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-sm leading-relaxed text-[#A1AAB8] sm:text-base"
            >
              Core front-end foundations, version control, and deployment practices I use while building and refining web projects.
            </m.p>
          </div>

          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="inline-flex w-fit items-center gap-1 rounded-xl border border-[#1E3A5F]/60 bg-[#111C30]/95 md:bg-[#111C30]/80 md:backdrop-blur-md p-1"
          >
            {SKILL_CATEGORIES.map((category, index) => {
              const isSelected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`skills-tab-${category.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="skills-tabpanel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveCategory(category.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap shrink-0 sm:text-sm ${
                    isSelected
                      ? 'bg-[#2563EB] text-[#F8FAFC] shadow-[0_0_16px_rgba(59,130,246,0.45)] hover:bg-[#1D4ED8]'
                      : 'text-[#A1AAB8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Depth Skill Cards Grid (without expensive layout projection) */}
        <div
          key={activeCategory}
          id="skills-tabpanel"
          role="tabpanel"
          aria-labelledby={`skills-tab-${activeCategory}`}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredSkills.map((skill, idx) => (
            <m.div
              key={skill.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.35,
                delay: idx * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <TiltCard
                maxTilt={5}
                className="h-full rounded-xl border border-[#1E3A5F]/60 bg-[#111C30]/95 md:bg-[#111C30]/80 md:backdrop-blur-md p-6 transition-colors hover:border-[#3B82F6]/65 hover:shadow-[0_12px_32px_rgba(59,130,246,0.16)]"
              >
                <div className="relative z-20 flex h-full flex-col justify-between gap-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold text-[#F8FAFC]">
                      {skill.name}
                    </h3>
                    <span className="font-mono text-xs tabular-nums text-[#60A5FA]">
                      {skill.index}.
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-[#A1AAB8]">
                    {skill.focus}
                  </p>
                </div>
              </TiltCard>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
