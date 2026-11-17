import savourHouseImg from '@/src/assets/images/savour_house_culinary.webp';

export interface NavLinkItem {
  label: string;
  href: string;
}

export type SkillCategory = 'all' | 'core' | 'workflow';

export interface SkillItem {
  id: string;
  index: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  focus: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  highlights: string[];
  liveUrl: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

export const PROFILE = {
  name: 'Gabriel Akintoye',
  title: 'Web Developer',
  heroIntro:
    'I build modern, responsive, and user-friendly websites with clean structure, thoughtful layout, and accessible front-end code.',
  aboutSummary:
    'I am a Computer Science student with a growing focus on web development and building practical digital solutions. I enjoy turning design ideas into responsive, reliable interfaces while continuously sharpening my technical skills through real projects.',
  aboutSecondary:
    'Every build is an opportunity to practice semantic markup, maintainable component structure, and smooth user interactions that work cleanly across desktop, tablet, and mobile screens.',
  email: 'gabrieloluwadamilanre@gmail.com',
  gmailComposeUrl:
    'https://mail.google.com/mail/?view=cm&fs=1&to=gabrieloluwadamilanre@gmail.com',
  whatsappDisplay: '+2348105755603',
  whatsappUrl: 'https://wa.me/2348105755603',
};

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All Skills' },
  { id: 'core', label: 'Core Web' },
  { id: 'workflow', label: 'Workflow & Delivery' },
];

export const SKILLS: SkillItem[] = [
  {
    id: 'html',
    index: '01',
    name: 'HTML',
    category: 'core',
    focus: 'Writing semantic, accessible document structures that support screen readers and search engines.',
  },
  {
    id: 'css',
    index: '02',
    name: 'CSS',
    category: 'core',
    focus: 'Crafting clean layouts, typographic hierarchy, and consistent visual spacing with modern CSS and Tailwind.',
  },
  {
    id: 'javascript',
    index: '03',
    name: 'JavaScript',
    category: 'core',
    focus: 'Building interactive client-side behavior, state updates, and dynamic DOM interactions.',
  },
  {
    id: 'react',
    index: '04',
    name: 'React',
    category: 'core',
    focus: 'Developing modular, component-driven user interfaces with reusable structure and state management.',
  },
  {
    id: 'git-github',
    index: '05',
    name: 'Git and GitHub',
    category: 'workflow',
    focus: 'Tracking code changes, managing repositories, and maintaining a clean project history.',
  },
  {
    id: 'responsive-design',
    index: '06',
    name: 'Responsive Web Design',
    category: 'core',
    focus: 'Adapting layouts thoughtfully so websites remain clear and usable across mobile, tablet, and desktop screens.',
  },
  {
    id: 'website-deployment',
    index: '07',
    name: 'Website Deployment',
    category: 'workflow',
    focus: 'Configuring builds and publishing live web applications with fast asset delivery.',
  },
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'savour-house',
    title: 'Savour House',
    subtitle: 'Restaurant & Online Ordering Experience',
    description:
      'A modern restaurant website featuring a menu, shopping cart, checkout experience and contact functionality.',
    technologies: ['React', 'TanStack Start', 'Vite', 'Tailwind CSS'],
    highlights: ['Interactive Menu', 'Shopping Cart', 'Checkout Flow', 'Contact Section'],
    liveUrl: 'https://pixels-to-living-layout.vercel.app',
    imageUrl: savourHouseImg,
    imageAlt: 'Plated culinary dish representing the Savour House restaurant web application',
    imageWidth: 1200,
    imageHeight: 675,
  },
];
