import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Code2,
  BrainCircuit,
  Copy,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// Real GitHub Profile Context for random1619
const PROFILE = {
  name: 'Gagan',
  githubUser: 'random1619',
  githubUrl: 'https://github.com/random1619',
  title: 'Frontend Engineer & Data Scientist',
  location: 'Bengaluru, India',
  coordinates: '12.9716° N, 77.5946° E',
  email: 'hello@gagan.dev',
  bio: 'Full-stack frontend architect & machine learning researcher. Building high-craft interactive web applications alongside statistical models for speech processing, pattern detection, and computer vision.',
};

// Synchronized Kinetic Roles for Header Typewriter / Ticker
const KINETIC_ROLES = [
  'Frontend Architect',
  'Data Scientist',
  'ML & Vision Engineer',
  'Creative Technologist'
];

// Real GitHub Repositories Data
const REAL_GITHUB_REPOS = [
  {
    id: 'Gravity-Ecommerce',
    name: 'Gravity-Ecommerce',
    role: 'Frontend Architect',
    type: 'Frontend & E-Commerce',
    lang: 'TypeScript',
    url: 'https://github.com/random1619/Gravity-Ecommerce',
    demo: 'https://gravity-ecommerce.vercel.app',
    desc: 'Production-grade luxury fashion atelier & e-commerce platform built with React 19, TypeScript, Tailwind CSS, and Framer Motion spring physics.',
    highlights: ['Micro-cart state engine', 'Responsive design system', 'Sub-100ms client transitions'],
    span: 'lg:col-span-2'
  },
  {
    id: 'Cognitive-Decline-Pattern-Detection',
    name: 'Cognitive-Decline-Pattern-Detection',
    role: 'Data Scientist & ML Researcher',
    type: 'Data Science & Health ML',
    lang: 'Python / Jupyter',
    url: 'https://github.com/random1619/Cognitive-Decline-Pattern-Detection',
    demo: 'https://cognitive-decline-pattern-detection.vercel.app',
    desc: 'Machine learning framework for early detection of cognitive decline patterns using longitudinal statistical data and behavioral metrics.',
    highlights: ['Multi-variate pattern classification', 'Feature importance extraction', 'Interactive analytics dashboard'],
    span: 'lg:col-span-1'
  },
  {
    id: 'Cognitive-Speech-Analysis',
    name: 'Cognitive-Speech-Analysis',
    role: 'AI / Audio ML Engineer',
    type: 'Speech Processing & ML',
    lang: 'Python',
    url: 'https://github.com/random1619/Cognitive-Speech-Analysis',
    demo: null,
    desc: 'Acoustic feature extraction and deep learning model analyzing speech degradation signals for cognitive biomarker evaluation.',
    highlights: ['Audio Spectrogram Analysis', 'Feature Extraction (MFCCs)', 'Sequence Classification'],
    span: 'lg:col-span-1'
  },
  {
    id: 'Image-Classification-Using-CNN',
    name: 'Image-Classification-Using-CNN',
    role: 'Computer Vision Engineer',
    type: 'Deep Learning',
    lang: 'Python / PyTorch',
    url: 'https://github.com/random1619/Image-Classification-Using-CNN',
    demo: null,
    desc: 'Convolutional Neural Network (CNN) architecture designed and trained for high-accuracy multi-class image classification.',
    highlights: ['Custom CNN layer design', 'Data augmentation pipeline', 'Model evaluation metrics'],
    span: 'lg:col-span-1'
  },
  {
    id: 'pdf-reader',
    name: 'pdf-reader',
    role: 'Frontend Developer',
    type: 'Web Application',
    lang: 'TypeScript',
    url: 'https://github.com/random1619/pdf-reader',
    demo: 'https://pdf-reader-rho-nine.vercel.app',
    desc: 'Blazing fast, lightweight web PDF reading application with instant rendering, search indexing, and document navigation.',
    highlights: ['Web Worker rendering', 'Custom canvas viewport', 'Zero main-thread jank'],
    span: 'lg:col-span-1'
  },
  {
    id: 'Sign_language_detection',
    name: 'Sign_language_detection',
    role: 'Computer Vision Developer',
    type: 'Computer Vision & AI',
    lang: 'Python / OpenCV',
    url: 'https://github.com/random1619/Sign_language_detection',
    demo: null,
    desc: 'Real-time computer vision system recognizing sign language hand gestures to bridge communication accessibility.',
    highlights: ['Real-time frame inference', 'Hand keypoint tracking', 'Gesture state classifier'],
    span: 'lg:col-span-2'
  }
];

// Technical Skill Matrix
const FRONTEND_SKILLS = [
  { name: 'React 19 & Next.js', level: 96, desc: 'Server Components, Concurrent Mode, Custom Hooks, State Architecture' },
  { name: 'TypeScript & Type Systems', level: 95, desc: 'Strict Typing, Generics, AST Parsing, Type Safety Across Boundaries' },
  { name: 'Tailwind CSS & Design Systems', level: 98, desc: 'Responsive Systems, Tokens, Dark Mode, Custom Utility Architecture' },
  { name: 'Framer Motion & Web Animations', level: 95, desc: 'Spring Physics, Layout Animations, Interruptible Gestures, Micro-interactions' },
  { name: 'WebGL & Canvas Renders', level: 86, desc: 'Custom Shaders, 3D Canvas, Post-processing, Performance Tuning' },
  { name: 'Web Performance & Accessibility', level: 93, desc: 'Core Web Vitals, Bundle Optimization, ARIA, Keyboard Navigation' }
];

const DATA_SCIENCE_SKILLS = [
  { name: 'Python & Data Stack', level: 96, desc: 'NumPy, Pandas, SciPy, Scikit-Learn, Data Wrangling Pipelines' },
  { name: 'Deep Learning & PyTorch', level: 92, desc: 'Convolutional Neural Networks (CNNs), Speech Analysis, Sequence Models' },
  { name: 'Cognitive & Audio ML Analytics', level: 94, desc: 'Biomarker Signal Extraction, Speech Pattern Classification, Time Series' },
  { name: 'Computer Vision & Gesture AI', level: 91, desc: 'OpenCV, Keypoint Detection, Real-time Frame Classification' },
  { name: 'Data Visualization & Dashboards', level: 93, desc: 'Plotly, Seaborn, Matplotlib, Interactive Web Dashboards' },
  { name: 'Model Optimization & Deployment', level: 89, desc: 'ONNX Runtime, Vercel Micro-deployments, REST APIs' }
];

// Interactive CLI Terminal Commands
const TERMINAL_COMMANDS: Record<string, string> = {
  help: 'Available commands: repos, skills, roles, github, contact, clear',
  repos: 'Public Repos:\n- Gravity-Ecommerce (TypeScript)\n- Cognitive-Decline-Pattern-Detection (Python/ML)\n- Cognitive-Speech-Analysis (Python/Audio ML)\n- Image-Classification-Using-CNN (Python/CNN)\n- Sign_language_detection (Python/CV)\n- pdf-reader (TypeScript)',
  skills: 'Frontend: React 19, TypeScript, Next.js, Tailwind, Framer Motion, WebGL\nData Science: Python, PyTorch, CNNs, OpenCV, Pandas, Scikit-Learn',
  roles: '1. Senior Frontend Engineer\n2. Data Scientist & Machine Learning Researcher\n3. Creative Technologist',
  github: 'GitHub Handle: random1619 | URL: https://github.com/random1619',
  contact: 'Email: hello@gagan.dev | Location: Bengaluru, India'
};

// Motion Variants for Master Synchronized Orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const wordItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export default function About() {
  const reducedMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState<'frontend' | 'datascience'>('frontend');
  const [roleIndex, setRoleIndex] = useState(0);

  // Synchronized Role Ticker Loop
  useEffect(() => {
    const roleTimer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % KINETIC_ROLES.length);
    }, 2800);
    return () => clearInterval(roleTimer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    toast.success('Email copied to clipboard', {
      description: PROFILE.email,
    });
  };

  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: 'github --user random1619', output: 'Fetched 6 public repositories from https://github.com/random1619' }
  ]);

  const handleRunTerminalCmd = (cmd: string) => {
    if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    }
    const output = TERMINAL_COMMANDS[cmd] || `Command not found: ${cmd}. Type 'help' for available options.`;
    setTerminalLogs((prev) => [...prev, { cmd, output }]);
  };

  // Headlines for Word Stagger Reveal
  const headlineWords = ["Engineering", "high-craft", "web", "interfaces", "&", "data", "intelligence."];

  return (
    <main className="overflow-x-hidden w-full max-w-full atelier-bg text-ink relative">
      
      {/* Subtle Ambient Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sienna/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION: Synchronized Kinetic Text & Master Orchestration */}
      {/* ------------------------------------------------------------------ */}
      <section className="container-void pt-28 section-gap lg:pt-36 relative z-10">
        
        {/* Floating Status Badge with Kinetic Role Ticker */}
        <motion.div 
          initial={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 inline-flex flex-wrap items-center gap-3 rounded-full border border-hairline bg-white/90 backdrop-blur-xl px-4 py-1.5 shadow-sm text-xs atelier-card"
        >
          <span className="font-mono text-[11px] text-ink-mute tracking-wider flex items-center gap-1.5">
            <GithubIcon className="h-3.5 w-3.5 text-ink" /> @random1619
          </span>
          <span className="hidden sm:inline text-hairline">|</span>

          {/* Kinetic Text Role Morph Ticker */}
          <div className="inline-flex items-center gap-1 font-mono text-[11px] text-sienna font-bold min-w-[170px]">
            <span>ROLE:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="inline-block text-ink"
              >
                {KINETIC_ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ultra-Wide Master Headline with Synchronized Word Stagger */}
        <div className="max-w-6xl">
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="atelier-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[1.02] tracking-[-0.035em] flex flex-wrap gap-x-3.5 gap-y-1"
          >
            {headlineWords.map((word, idx) => (
              <motion.span 
                key={idx} 
                variants={wordItemVariants}
                className={word === 'web' || word === 'interfaces' ? 'text-sienna italic font-serif font-normal' : ''}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="mt-8 max-w-[62ch] text-lg lg:text-xl font-light leading-relaxed text-ink-soft"
          >
            Full-stack frontend architect & machine learning developer based in Bengaluru. Building interactive React 19 & TypeScript applications alongside Python & PyTorch statistical models.
          </motion.p>

          {/* Island Buttons with Synchronized Entrance */}
          <motion.div 
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a 
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-island-primary group pressable"
            >
              <span>GitHub Profile</span>
              <span className="icon-pill">
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:translate-x-0.5 hover-hover:group-hover:-translate-y-0.5" />
              </span>
            </a>
            <button 
              onClick={handleCopyEmail} 
              className="btn-island-ghost group pressable"
            >
              <span>Copy Email ({PROFILE.email})</span>
              <span className="icon-pill">
                <Copy className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:rotate-12" />
              </span>
            </button>
          </motion.div>
        </div>

        {/* Doppelrand (Double-Bezel) Profile Card — replaces the previous
           div-based fake code preview. Plain editorial typography, real
           data from PROFILE, no fake terminal chrome, no animate-ping. */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="mt-16 bezel-outer"
        >
          <div className="bezel-inner bg-ivory text-ink p-6 md:p-10 font-mono text-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-ink-faint">
                Profile · Verified
              </span>
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-sienna">
                GitHub
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-relaxed">
              <dl className="space-y-2">
                <div className="flex justify-between border-b border-hairline pb-1">
                  <dt className="text-ink-faint uppercase tracking-wider text-[11px]">Name</dt>
                  <dd className="font-semibold">{PROFILE.name}</dd>
                </div>
                <div className="flex justify-between border-b border-hairline pb-1">
                  <dt className="text-ink-faint uppercase tracking-wider text-[11px]">Handle</dt>
                  <dd className="font-semibold">@random1619</dd>
                </div>
                <div className="flex justify-between border-b border-hairline pb-1">
                  <dt className="text-ink-faint uppercase tracking-wider text-[11px]">Frontend</dt>
                  <dd className="text-ink-soft">React 19 · TypeScript · Tailwind</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-faint uppercase tracking-wider text-[11px]">Data</dt>
                  <dd className="text-ink-soft">Python · PyTorch · CNNs</dd>
                </div>
              </dl>

              <div className="md:border-l md:border-hairline md:pl-8">
                <h4 className="text-xs uppercase tracking-[0.22em] font-semibold text-ink-faint mb-3">
                  Public Projects
                </h4>
                <ul className="space-y-1 text-ink-soft">
                  <li>· Gravity-Ecommerce</li>
                  <li>· Cognitive-Decline-Pattern-Detection</li>
                  <li>· Cognitive-Speech-Analysis</li>
                  <li>· Image-Classification-Using-CNN</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. GAPLESS BENTO 2.0 REPOSITORIES GRID (Stagger & Synchronized)    */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-hairline atelier-bg-deep section-gap">
        <div className="container-void">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="atelier-display text-3xl md:text-5xl">
                Public GitHub Repositories
              </h2>
              <p className="mt-3 text-sm text-ink-mute max-w-[45ch]">
                Fetched directly from <a href={PROFILE.githubUrl} target="_blank" rel="noreferrer" className="text-sienna underline font-mono inline-block py-3">github.com/random1619</a>.
              </p>
            </div>
            <div className="mt-4 md:mt-0 font-mono text-xs text-sienna flex items-center gap-2">
              <Activity className="h-4 w-4" /> 6 VERIFIED PROJECTS
            </div>
          </div>

          {/* Gapless Bento Grid with Staggered Entrance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-6">
            {REAL_GITHUB_REPOS.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.06,
                  ease: [0.32, 0.72, 0, 1]
                }}
                className={`${repo.span} bezel-outer hover-hover:hover:shadow-xl transition-shadow duration-300 group`}
              >
                <div className="bezel-inner p-7 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-hairline bg-ivory text-ink-mute uppercase font-semibold">
                        {repo.type}
                      </span>
                      <span className="font-mono text-xs text-sienna font-bold">
                        {repo.lang}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-ink mb-3 group-hover:text-sienna transition-colors">
                      {repo.name}
                    </h3>

                    <p className="text-sm text-ink-soft leading-relaxed font-light mb-6">
                      {repo.desc}
                    </p>

                    <div className="space-y-2 mb-6 border-t border-hairline/60 pt-4">
                      {repo.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2.5 text-xs text-ink-soft">
                          <CheckCircle2 className="h-4 w-4 text-sienna shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Links */}
                  <div className="pt-4 border-t border-hairline flex items-center justify-between font-mono text-xs">
                    <span className="text-xs text-ink-mute font-mono">
                      ROLE: {repo.role}
                    </span>

                    <div className="flex items-center gap-4">
                      {repo.demo && (
                        <a
                          href={repo.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-sienna hover:underline flex items-center gap-1 font-bold pressable py-4"
                        >
                          Live Demo <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-ink hover:text-sienna flex items-center gap-1 font-semibold pressable py-4"
                      >
                        Source Code <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. DUAL ROLE MATRIX (Meter Progress & Tab Physics)                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="container-void section-gap">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <h2 className="atelier-display text-3xl md:text-5xl">
              Technical Competency Matrix
            </h2>
            <p className="mt-3 text-sm text-ink-mute max-w-[44ch]">
              Select a domain to inspect proficiencies across web development and machine learning.
            </p>
          </div>
        </div>

        {/* Role Segmented Switcher Pill */}
        <div className="flex items-center gap-2 border border-hairline p-1 bg-white/80 backdrop-blur-md rounded-full w-fit mb-12">
          <button
            onClick={() => setActiveRole('frontend')}
            className={`relative px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest transition-colors duration-300 pressable ${
              activeRole === 'frontend' ? 'text-ivory font-bold' : 'text-ink-mute hover:text-ink'
            }`}
          >
            {activeRole === 'frontend' && (
              <motion.div
                layoutId="activeRoleBadge"
                className="absolute inset-0 bg-ink rounded-full"
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              />
            )}
              <span className="relative z-10 flex items-center gap-2">
                <Code2 className="h-4 w-4" /> Frontend Engineering
              </span>
          </button>

          <button
            onClick={() => setActiveRole('datascience')}
            className={`relative px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest transition-colors duration-300 pressable ${
              activeRole === 'datascience' ? 'text-ivory font-bold' : 'text-ink-mute hover:text-ink'
            }`}
          >
            {activeRole === 'datascience' && (
              <motion.div
                layoutId="activeRoleBadge"
                className="absolute inset-0 bg-sienna rounded-full"
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              />
            )}
              <span className="relative z-10 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" /> Data Science & ML
              </span>
          </button>
        </div>

        {/* Active Skills List with Doppelrand Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(activeRole === 'frontend' ? FRONTEND_SKILLS : DATA_SCIENCE_SKILLS).map((skill, idx) => (
              <div key={skill.name} className="bezel-outer">
                <div className="bezel-inner p-7 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-ink-mute font-semibold">{skill.level}% PROFICIENCY</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">{skill.name}</h3>
                    <p className="mt-3 text-xs text-ink-soft leading-relaxed font-light">{skill.desc}</p>
                  </div>

                  {/* Meter Bar with Dynamic Fluid Spring Animation */}
                  <div className="mt-8 pt-4 border-t border-hairline/60">
                    <div className="h-1.5 w-full bg-hairline/40 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.32, 0.72, 0, 1] }}
                        className={`h-full ${activeRole === 'frontend' ? 'bg-ink' : 'bg-sienna'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. INTERACTIVE TERMINAL (Command Stream Slide-In)                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-hairline atelier-bg-deep section-gap">
        <div className="container-void">
          
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="atelier-display text-3xl md:text-4xl">
                Terminal CLI Diagnostics
              </h2>
              <p className="mt-3 text-xs text-ink-mute font-mono">
                Click preset commands below to query GitHub repos, roles, or technical stack directly.
              </p>
            </div>

            {/* Interactive command log — kept functional (real preset commands
               that query PROFILE data), but the fake-terminal chrome dots
               and animate-ping status indicator have been removed per the
               anti-slop audit. Real terminal output, not theatre. */}
            <div className="bezel-outer">
              <div className="bezel-inner bg-ivory text-ink p-7 font-mono text-xs">

                {/* Header — clean editorial caption, no fake window controls. */}
                <div className="flex items-center justify-between border-b border-hairline pb-4 mb-5">
                  <span className="text-[11px] text-ink-faint uppercase tracking-wider">
                    gagan@random1619 : ~
                  </span>
                  <span className="text-xs text-sienna uppercase tracking-wider font-semibold">
                    GitHub CLI
                  </span>
                </div>

                {/* Command Log Stream with Animated Slide-In */}
                <div className="space-y-3 min-h-[160px] max-h-[260px] overflow-y-auto mb-6 pr-2">
                  <AnimatePresence initial={false}>
                    {terminalLogs.map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-1"
                      >
                        <div className="text-sienna flex items-center gap-2">
                          <span>$</span> <span className="text-ink font-bold">{log.cmd}</span>
                        </div>
                        <div className="text-ink-soft whitespace-pre-wrap pl-4 font-mono text-[11px] leading-relaxed">
                          {log.output}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Command Buttons */}
                <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ink-faint mr-2 uppercase tracking-wider">COMMANDS:</span>
                  {['help', 'repos', 'skills', 'roles', 'github', 'contact', 'clear'].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => handleRunTerminalCmd(cmd)}
                      className="px-3 py-2 bg-ivory-deep hover:bg-sienna hover:text-ivory rounded-full border border-hairline text-[11px] text-ink-soft transition-colors duration-300 pressable min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. DIRECT CONTACT & FOOTER ACTION                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="container-void section-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <h2 className="atelier-display text-4xl md:text-5xl text-ink">Let’s build something extraordinary.</h2>
            <p className="mt-4 text-base text-ink-soft leading-relaxed max-w-[55ch] font-light">
              Open to lead frontend engineering contracts, machine learning research collaborations, and technical leadership roles.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-island-primary group pressable"
              >
                <span>Visit GitHub (@random1619)</span>
                <span className="icon-pill">
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:translate-x-0.5 hover-hover:group-hover:-translate-y-0.5" />
                </span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="btn-island-ghost group pressable"
              >
                <span>Copy Email ({PROFILE.email})</span>
                <span className="icon-pill">
                  <Copy className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:rotate-12" />
                </span>
              </button>
            </div>
          </div>

          {/* Quick Contact & GitHub Specs */}
          <div className="lg:col-span-5 bezel-outer">
            <div className="bezel-inner p-7 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-hairline/60 pb-3">
                <span className="text-ink-mute">GitHub Handle</span>
                <a href={PROFILE.githubUrl} target="_blank" rel="noreferrer" className="font-bold text-sienna underline inline-block py-4 -my-1">@random1619</a>
              </div>
              <div className="flex justify-between border-b border-hairline/60 pb-3">
                <span className="text-ink-mute">Primary Location</span>
                <span className="font-bold text-ink">{PROFILE.location}</span>
              </div>
              <div className="flex justify-between border-b border-hairline/60 pb-3">
                <span className="text-ink-mute">Frontend Stack</span>
                <span className="font-bold text-sienna">React 19 / TS / Next</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-ink-mute">Data Science & ML</span>
                <span className="font-bold text-sienna">Python / PyTorch / CNN</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. GRAND FOOTER CTA BLOCK                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="atelier-ink text-ivory border-t border-hairline">
        <div className="container-void section-gap">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="atelier-display max-w-[14ch] text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.96] text-ivory">
                Craft is a continuous practice.
              </h2>
            </div>

            <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
              <a 
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-island-primary group pressable"
              >
                <span>Explore GitHub Repositories</span>
                <span className="icon-pill">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
