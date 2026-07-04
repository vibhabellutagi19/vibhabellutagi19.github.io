'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SearchPalette } from '@/components/terminal/SearchPalette';
import { experienceData, projectsData } from '@/data/site';
import { executeTerminalCommand, filterBlogPosts } from '@/lib/terminal/commands';
import { buildSearchIndex } from '@/lib/terminal/searchIndex';

const THEMES = ['forge', 'gruvbox', 'dracula', 'nord', 'paper', 'monokai'];
const FILE_NAMES = {
  home: 'home.md',
  experience: 'experience.git/log',
  projects: 'projects/README.md',
  blog: 'blog/index.md',
  contact: '.env',
};

function getSections() {
  return projectsData.length > 0
    ? ['home', 'experience', 'projects', 'blog', 'contact']
    : ['home', 'experience', 'blog', 'contact'];
}

function getSectionKeyMap() {
  return projectsData.length > 0
    ? { 0: 'home', 1: 'experience', 2: 'projects', 3: 'blog', 4: 'contact' }
    : { 0: 'home', 1: 'experience', 2: 'blog', 3: 'contact' };
}

function setTheme(theme) {
  if (!THEMES.includes(theme)) {
    return false;
  }
  if (theme === 'forge') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('theme', theme);
  return true;
}

export function TerminalShell({ children, blogPosts = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  const [clock, setClock] = useState('--:--');
  const [activeSection, setActiveSection] = useState('home');
  const [currentFile, setCurrentFile] = useState('~/portfolio/home.md');
  const [scrollPct, setScrollPct] = useState('Top');
  const [themeLabel, setThemeLabel] = useState('forge');
  const [termOpen, setTermOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState('');
  const [mode, setMode] = useState('NORMAL');

  const termOutRef = useRef(null);
  const termInputRef = useRef(null);
  const cmdInputRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const sections = useMemo(() => getSections(), []);
  const sectionKeyMap = useMemo(() => getSectionKeyMap(), []);
  const hasProjects = projectsData.length > 0;
  const blogNavIdx = hasProjects ? 3 : 2;
  const contactNavIdx = hasProjects ? 4 : 3;

  const searchIndex = useMemo(
    () => buildSearchIndex({ blogPosts, experience: experienceData, projects: projectsData }),
    [blogPosts]
  );

  const visibleBlogPosts = useMemo(
    () => filterBlogPosts(blogPosts, sidebarQuery),
    [blogPosts, sidebarQuery]
  );

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'paper';
    setTheme(saved);
    setThemeLabel(saved);
  }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    }
    tick();
    const interval = setInterval(tick, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
        setCurrentFile(`~/portfolio/blog/${pathname.split('/').filter(Boolean).pop()}.md`);
      } else if (pathname === '/blog/') {
        setCurrentFile('~/portfolio/blog/index.md');
      }
      return undefined;
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setScrollPct(y <= 2 ? 'Top' : y >= max - 2 ? 'Bot' : `${Math.round((y / max) * 100)}%`);

      const sectionEls = sections.map((id) => document.getElementById(id)).filter(Boolean);
      let active = sectionEls[0];
      for (const section of sectionEls) {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.4) {
          active = section;
        }
      }
      if (active) {
        setActiveSection(active.id);
        setCurrentFile(`~/portfolio/${FILE_NAMES[active.id]}`);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, pathname, sections]);

  const cycleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'forge';
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    setTheme(next);
    setThemeLabel(next);
  };

  const scrollToSection = useCallback(
    (id) => {
      if (id === 'blog' && !isHome) {
        router.push('/blog/');
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (!isHome && id !== 'blog') {
        window.location.href = `/#${id}`;
      }
    },
    [isHome, router]
  );

  const applySearchSelection = useCallback(
    (item) => {
      if (!item) {
        return;
      }

      if (item.action === 'terminal') {
        setTermOpen(true);
        return;
      }

      if (item.action === 'email') {
        window.location.href = 'mailto:vibhavari.bellutagi@gmail.com';
        return;
      }

      if (item.type === 'blog' && item.href) {
        window.location.assign(item.href);
        return;
      }

      if (item.section) {
        if (item.section === 'blog' && !isHome) {
          router.push('/blog/');
          return;
        }
        if (isHome) {
          scrollToSection(item.section);
          return;
        }
      }

      if (item.href) {
        if (item.href.startsWith('/#') && isHome) {
          scrollToSection(item.href.slice(2));
        } else {
          window.location.href = item.href;
        }
      }
    },
    [isHome, router, scrollToSection]
  );

  const tprint = useCallback((html, className) => {
    const container = termOutRef.current;
    if (!container) {
      return;
    }
    const line = document.createElement('div');
    if (className) {
      line.className = className;
    }
    line.innerHTML = html;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }, []);

  const runEffects = useCallback(
    (effects) => {
      for (const effect of effects) {
        switch (effect.type) {
          case 'clear':
            if (termOutRef.current) {
              termOutRef.current.innerHTML = '';
            }
            break;
          case 'closeTerminal':
            setTermOpen(false);
            break;
          case 'section':
            scrollToSection(effect.id);
            break;
          case 'navigate':
            router.push(effect.href);
            break;
          case 'select':
            applySearchSelection(effect.item);
            break;
          case 'theme':
            setThemeLabel(effect.name);
            break;
          default:
            break;
        }
      }
    },
    [applySearchSelection, router, scrollToSection]
  );

  const runTerminalCommand = useCallback(
    (raw) => {
      const { output, effects } = executeTerminalCommand(raw, {
        searchIndex,
        blogPosts,
        sections,
        setTheme,
        themes: THEMES,
      });

      for (const line of output) {
        tprint(line.html, line.className);
      }
      runEffects(effects);
    },
    [blogPosts, runEffects, searchIndex, tprint]
  );

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target === cmdInputRef.current || event.target === termInputRef.current) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === '`') {
        event.preventDefault();
        setTermOpen((open) => !open);
      }
      if (event.key === '/' && !paletteOpen) {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === ':' && isHome) {
        event.preventDefault();
        setCmdOpen(true);
        setMode('COMMAND');
        setTimeout(() => cmdInputRef.current?.focus(), 0);
      }
      if (isHome && ['0', '1', '2', '3', '4'].includes(event.key)) {
        const target = sectionKeyMap[event.key];
        if (target) {
          scrollToSection(target);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isHome, paletteOpen, scrollToSection, sectionKeyMap]);

  const closeCmd = () => {
    setCmdOpen(false);
    setMode('NORMAL');
  };

  const runCommandMode = (raw) => {
    const value = raw.trim();
    const lower = value.toLowerCase();
    const [word, ...rest] = lower.split(/\s+/);
    const arg = rest.join(' ');

    if (lower === 'q') {
      closeCmd();
      return;
    }
    if (sections.includes(lower)) {
      scrollToSection(lower);
      closeCmd();
      return;
    }
    if (word === 'colorscheme' || word === 'theme') {
      if (setTheme(arg)) {
        setThemeLabel(arg);
      }
      closeCmd();
      return;
    }
    if (lower === 'term') {
      setTermOpen(true);
      closeCmd();
      return;
    }
    if (word === 'grep' || word === 'find' || word === 'search') {
      setPaletteOpen(true);
      closeCmd();
      return;
    }
  };

  return (
    <>
      <header className="tmux">
        <div className="session">[portfolio]</div>
        <nav>
          {isHome ? (
            <>
              <a
                href="#home"
                className={activeSection === 'home' ? 'active' : ''}
                onClick={() => scrollToSection('home')}
              >
                <span className="idx">0:</span>home
              </a>
              <a
                href="#experience"
                className={activeSection === 'experience' ? 'active' : ''}
                onClick={() => scrollToSection('experience')}
              >
                <span className="idx">1:</span>experience
              </a>
              {hasProjects && (
                <a
                  href="#projects"
                  className={activeSection === 'projects' ? 'active' : ''}
                  onClick={() => scrollToSection('projects')}
                >
                  <span className="idx">2:</span>projects
                </a>
              )}
              <a
                href="#blog"
                className={activeSection === 'blog' ? 'active' : ''}
                onClick={() => scrollToSection('blog')}
              >
                <span className="idx">{blogNavIdx}:</span>blog
              </a>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={() => scrollToSection('contact')}
              >
                <span className="idx">{contactNavIdx}:</span>contact
              </a>
            </>
          ) : (
            <>
              <Link href="/#home">
                <span className="idx">0:</span>home
              </Link>
              <Link href="/#experience">
                <span className="idx">1:</span>experience
              </Link>
              {hasProjects && (
                <Link href="/#projects">
                  <span className="idx">2:</span>projects
                </Link>
              )}
              <Link href="/blog/" className={pathname.startsWith('/blog') ? 'active' : ''}>
                <span className="idx">{blogNavIdx}:</span>blog
              </Link>
              <Link href="/#contact">
                <span className="idx">{contactNavIdx}:</span>contact
              </Link>
            </>
          )}
        </nav>
        <div className="spacer" />
        <div className="right">
          <button type="button" className="tbtn" onClick={() => setPaletteOpen(true)}>
            / search
          </button>
          <a className="contact-chip" href="mailto:vibhavari.bellutagi@gmail.com">
            ✉ vibhavari.bellutagi@gmail.com
          </a>
          <button type="button" className="tbtn" onClick={() => setTermOpen((o) => !o)}>
            &gt;_ terminal
          </button>
          <button type="button" className="tbtn" onClick={cycleTheme}>
            ◑ theme
          </button>
          <span>{clock}</span>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="File explorer">
          <div className="treetitle">EXPLORER · ~/portfolio</div>
          <label className="sidebar-search">
            <span className="glyph">/</span>
            <input
              type="search"
              value={sidebarQuery}
              onChange={(event) => setSidebarQuery(event.target.value)}
              placeholder="Filter files…"
              aria-label="Filter explorer"
              spellCheck={false}
            />
          </label>
          <ul className="tree">
            {!sidebarQuery && (
              <>
                <li>
                  <button
                    type="button"
                    className={isHome && activeSection === 'home' ? 'active' : ''}
                    onClick={() =>
                      isHome ? scrollToSection('home') : (window.location.href = '/#home')
                    }
                  >
                    <span className="glyph">▸</span>home.md
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={isHome && activeSection === 'experience' ? 'active' : ''}
                    onClick={() =>
                      isHome ? scrollToSection('experience') : (window.location.href = '/#experience')
                    }
                  >
                    <span className="glyph">▸</span>experience.git
                  </button>
                </li>
                {hasProjects && (
                  <li>
                    <button
                      type="button"
                      className={`dir${isHome && activeSection === 'projects' ? ' active' : ''}`}
                      onClick={() =>
                        isHome ? scrollToSection('projects') : (window.location.href = '/#projects')
                      }
                    >
                      <span className="glyph">▾</span>projects/
                    </button>
                    <ul className="tree sub">
                      {projectsData.map((project) => (
                        <li key={project.slug}>
                          <button
                            type="button"
                            onClick={() =>
                              isHome
                                ? scrollToSection('projects')
                                : (window.location.href = '/#projects')
                            }
                          >
                            <span className="glyph">·</span>
                            {project.slug}/
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </>
            )}
            <li>
              <button
                type="button"
                className={`dir${
                  (isHome && activeSection === 'blog') || pathname.startsWith('/blog') ? ' active' : ''
                }`}
                onClick={() =>
                  isHome ? scrollToSection('blog') : router.push('/blog/')
                }
              >
                <span className="glyph">▾</span>blog/
              </button>
              <ul className="tree sub">
                {visibleBlogPosts.length === 0 ? (
                  <li className="tree-empty">No matches</li>
                ) : (
                  visibleBlogPosts.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}/`}>
                        <span className="glyph">·</span>
                        {post.slug}.md
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </li>
            {!sidebarQuery && (
              <li>
                <button
                  type="button"
                  className={isHome && activeSection === 'contact' ? 'active' : ''}
                  onClick={() =>
                    isHome ? scrollToSection('contact') : (window.location.href = '/#contact')
                  }
                >
                  <span className="glyph">▸</span>.env
                </button>
              </li>
            )}
          </ul>
        </aside>

        <div className="buffer">{children}</div>
      </div>

      <SearchPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        searchIndex={searchIndex}
        onSelect={applySearchSelection}
      />

      <div className={`termpane${termOpen ? ' open' : ''}`} aria-label="Interactive terminal">
        <div className="thead">
          <span>TERMINAL · bash · ~/portfolio</span>
          <button type="button" className="close" onClick={() => setTermOpen(false)}>
            ✕ close
          </button>
        </div>
        <div className="termout" ref={termOutRef} />
        <div className="termin">
          <span className="tp">vibhavari@portfolio:~$</span>
          <input
            ref={termInputRef}
            type="text"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
            placeholder="try: grep spark · ls blog · open git"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const value = event.currentTarget.value;
                if (value.trim()) {
                  historyRef.current.push(value);
                  historyIndexRef.current = historyRef.current.length;
                }
                runTerminalCommand(value);
                event.currentTarget.value = '';
              } else if (event.key === 'Escape') {
                setTermOpen(false);
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (historyRef.current.length === 0) {
                  return;
                }
                historyIndexRef.current = Math.max(0, historyIndexRef.current - 1);
                event.currentTarget.value = historyRef.current[historyIndexRef.current] || '';
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (historyRef.current.length === 0) {
                  return;
                }
                historyIndexRef.current = Math.min(
                  historyRef.current.length,
                  historyIndexRef.current + 1
                );
                event.currentTarget.value =
                  historyIndexRef.current >= historyRef.current.length
                    ? ''
                    : historyRef.current[historyIndexRef.current];
              }
            }}
          />
        </div>
      </div>

      <div className={`cmdline${cmdOpen ? ' open' : ''}`}>
        <span className="colon">:</span>
        <input
          ref={cmdInputRef}
          type="text"
          autoComplete="off"
          spellCheck={false}
          aria-label="Command input"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              closeCmd();
            }
            if (event.key === 'Enter') {
              runCommandMode(event.currentTarget.value);
              event.currentTarget.value = '';
            }
          }}
          onBlur={closeCmd}
        />
        <span className="hint">home · grep spark · theme paper · term</span>
      </div>

      <footer className="statusline">
        <div className={`mode${mode === 'COMMAND' ? ' command' : ''}`}>{mode}</div>
        <div className="file">{currentFile}</div>
        <div className="spacer" />
        <div className="meta">⌘K search</div>
        <div className="meta">theme: {themeLabel}</div>
        <div className="meta">
          <span className="pct">{scrollPct}</span>
        </div>
      </footer>
    </>
  );
}
