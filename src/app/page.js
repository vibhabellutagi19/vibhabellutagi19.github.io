import Link from 'next/link';

import { PostTags } from '@/components/blog/PostList';
import { ReadMark } from '@/components/blog/ReadMark';
import { GymDemo } from '@/components/demos/GymDemo';
import { PgDemo } from '@/components/demos/PgDemo';
import { LessonCard } from '@/components/home/LessonCard';
import { NoteCards } from '@/components/notes/NoteList';
import { Reveal } from '@/components/ui/Reveal';
import {
  aboutData,
  experienceData,
  heroData,
  impactData,
  lessonsData,
  pinnedPosts,
  pillarsData,
  previousCompanies,
  profile,
  resumeLink,
  sideProjects,
  testimonialsData,
} from '@/data/site';
import { getAllNotes } from '@/lib/notes';
import { formatTag, getAllPosts, pickPosts } from '@/lib/posts';

const DEMOS = { gym: GymDemo, pg: PgDemo };
const NUMERALS = ['i.', 'ii.', 'iii.'];

function ResumeButton({ className = 'btn btn-primary btn-lg' }) {
  return (
    <a className={className} href={resumeLink.href} {...(resumeLink.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {resumeLink.label}
    </a>
  );
}

function Hero({ lessons, total }) {
  return (
    <div className="dark">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-id">
              <img className="hero-avatar" src={profile.avatar} alt={profile.name} width="56" height="56" fetchPriority="high" />
              <p className="status">
                <span className="dot" aria-hidden="true" />
                {heroData.status}
              </p>
            </div>
            <h1>
              I build data platforms, <span className="serif">and</span> the backends that feed them.
            </h1>
            <p className="hero-lede">
              {heroData.lede} {total} posts so far.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#learn">
                Start learning
              </a>
              <a className="btn btn-ghost-dark btn-lg" href="#about">
                About me
              </a>
              <div className="hero-icons">
                <a className="icon-btn" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                  </svg>
                </a>
                <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <LessonCard lessons={lessons} />
        </div>
      </section>

      <div className="previously">
        <div className="container previously-row">
          <span className="previously-label">Previously at</span>
          <ul>
            {previousCompanies.map(({ name, url }) => (
              <li key={name}>
                <a className="company-link" href={url} target="_blank" rel="noreferrer" title={`${name} website`}>
                  {name}
                  <span className="company-link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Pinned posts (pinnedPosts in site.js), in their order. Everything else lives on /blog. */
function SelectedPosts({ posts, total }) {
  const tagLabels = Object.fromEntries(posts.flatMap((post) => post.tags).map((tag) => [tag, formatTag(tag)]));

  return (
    <section id="learn" className="home-section" aria-labelledby="learn-title">
      <div className="container">
        <p className="label">01 / Blog</p>
        <div className="section-row">
          <h2 id="learn-title" className="h-section" style={{ maxWidth: 680 }}>
            Highlights of my <span className="serif">writing.</span>
          </h2>
          <p>Every post starts from something that surprised me, then explains the mechanism with a small worked example.</p>
        </div>
        <ul className="post-list recent-posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="post-item" href={`/blog/${post.slug}/`}>
                <span className="post-meta">
                  {post.date} · {post.readTime}
                  <ReadMark slug={post.slug} />
                </span>
                <span className="post-title">{post.title}</span>
                {post.excerpt && <span className="post-excerpt">{post.excerpt}</span>}
                <PostTags tags={post.tags} tagLabels={tagLabels} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="home-notes-foot">
          <Link className="text-link" href="/blog/">
            All {total} posts, by topic →
          </Link>
        </p>
      </div>
    </section>
  );
}

function LatestNotes({ notes }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section id="notes" className="home-section" aria-labelledby="notes-title">
      <div className="container">
        <p className="label">02 / Notes</p>
        <div className="section-row">
          <h2 id="notes-title" className="h-section" style={{ maxWidth: 640 }}>
            One blog a day. <span className="serif">What stuck.</span>
          </h2>
          <p>Short, linked notes on the engineering blogs I read: how it works, what it trades away, what I still wonder.</p>
        </div>
        <NoteCards notes={notes} />
        <p className="home-notes-foot">
          <Link className="text-link" href="/notes/">
            All notes →
          </Link>
        </p>
      </div>
    </section>
  );
}

function SideProjects() {
  return (
    <section id="projects" className="home-section" aria-labelledby="projects-title">
      <div className="container">
        <p className="label">03 / Side projects</p>
        <div className="section-row">
          <h2 id="projects-title" className="h-section" style={{ maxWidth: 640 }}>
            Each app has one <span className="serif">hard part.</span> That is the lesson.
          </h2>
          <p>Real apps with real constraints: payments, concurrency, auth. The hard parts become blog posts.</p>
        </div>

        <div className="projects">
          {sideProjects.map((project, index) => {
            const Demo = DEMOS[project.demo];
            const dark = index === 0;
            return (
              <Reveal as="article" key={project.name} className={`project${dark ? ' dark' : ''}`} delay={index * 80}>
                <div>
                  <p className="project-hard-label">The hard part</p>
                  <h3>{project.hardPart}</h3>
                </div>
                <div className="project-frame">
                  <Demo />
                </div>
                <div className="project-about">
                  <p className="project-name">{project.name}</p>
                  <p className="project-summary">{project.summary}</p>
                  <p className="project-stack">{project.stack.join(' · ')}</p>
                </div>
                {project.post ? (
                  <Link className={`btn project-cta ${dark ? 'btn-sand' : 'btn-ghost'}`} href={project.post.href}>
                    {project.post.label} →
                  </Link>
                ) : (
                  <p className="project-soon">Post coming</p>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="home-section about" aria-labelledby="about-title">
      <div className="container">
        <p className="label">04 / About</p>
        <h2 id="about-title" className="h-section" style={{ marginBottom: 48 }}>
          Who is <span className="serif">writing</span> this.
        </h2>

        <div className="about-grid">
          <div className="about-visual">
            <figure className="about-photo">
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="768" height="1024" loading="lazy" />
            </figure>
            <div className="ledger">
              <p className="ledger-cmd" aria-hidden="true">
                $ impact --since 2018
              </p>
              <dl aria-label="Impact since 2018">
                {impactData.map((row) => (
                  <div key={row.what}>
                    <dt>{row.what}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="about-copy">
            <p>{aboutData.bio}</p>
            <ul className="skills">
              {pillarsData.map((pillar, index) => (
                <li key={pillar.title}>
                  <span className="skills-num" aria-hidden="true">
                    {NUMERALS[index]}
                  </span>
                  <div>
                    {pillar.label && <p className="skills-label">{pillar.label}</p>}
                    <h3>{pillar.title}</h3>
                    <p>{pillar.body}</p>
                    <p className="skills-tools">{pillar.tools.join(' · ')}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ResumeButton className="btn btn-ghost" />
          </div>
        </div>

        <h3 id="experience" className="timeline-title">
          Where I have <span className="serif">shipped.</span>
        </h3>
        <ol className="timeline">
          {experienceData.map((job) => (
            <li key={job.id}>
              <p className="timeline-meta">
                <span>{job.date}</span>
                {job.place && <span>{job.place}</span>}
              </p>
              <h4>
                {job.title} <span>· {job.company}</span>
              </h4>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function KindWords() {
  const [lead, ...rest] = testimonialsData;

  return (
    <section className="kind-words" aria-label="Recommendations">
      <div className="container kind-words-inner">
        <figure className="quote-lead">
          <svg width="44" height="34" viewBox="0 0 44 34" fill="currentColor" aria-hidden="true">
            <path d="M0 34V20C0 8 6 1 18 0v7c-6 1-9 5-9 11h9v16H0Zm26 0V20C26 8 32 1 44 0v7c-6 1-9 5-9 11h9v16H26Z" />
          </svg>
          <blockquote>“{lead.quote}”</blockquote>
          <figcaption>
            <strong>{lead.name}</strong> · {lead.role}
          </figcaption>
        </figure>
        <div className="quote-row">
          {rest.map((item) => (
            <figure className="quote-card" key={item.name}>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                {item.name} · {item.role}
              </figcaption>
            </figure>
          ))}
        </div>
        <a className="text-link" href={profile.linkedinRecommendations} target="_blank" rel="noreferrer">
          Read all {profile.recommendationCount} recommendations on LinkedIn →
        </a>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact-card dark">
          <div>
            <p className="label">05 / Contact</p>
            <h2 id="contact-title">
              Hiring a <span className="serif">data or backend</span> engineer?
            </h2>
            <p>
              Senior data engineering and data platform roles, or backend roles where the data model matters. Remote or
              hybrid. Questions about a post are welcome too.
            </p>
          </div>
          <div className="hero-actions">
            <ResumeButton />
            <a className="btn btn-ghost-dark btn-lg" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn btn-ghost-dark btn-lg" href={`mailto:${profile.email}`}>
              Email
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const posts = await getAllPosts();
  const notes = (await getAllNotes()).filter((note) => note.status === 'published').slice(0, 3);
  const bySlug = Object.fromEntries(posts.map((post) => [post.slug, post]));
  const lessons = lessonsData
    .filter((lesson) => bySlug[lesson.slug])
    .map((lesson) => ({ ...lesson, title: bySlug[lesson.slug].title, href: `/blog/${lesson.slug}/` }));

  return (
    <main>
      <Hero lessons={lessons} total={posts.length} />
      <SelectedPosts posts={pickPosts(posts, pinnedPosts)} total={posts.length} />
      <LatestNotes notes={notes} />
      <SideProjects />
      <About />
      <KindWords />
      <Contact />
    </main>
  );
}
