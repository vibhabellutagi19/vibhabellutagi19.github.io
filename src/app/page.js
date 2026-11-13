import Link from 'next/link';

import { GymDemo } from '@/components/demos/GymDemo';
import { PgDemo } from '@/components/demos/PgDemo';
import { Reveal } from '@/components/ui/Reveal';
import {
  experienceData,
  heroData,
  impactData,
  pillarsData,
  previousCompanies,
  profile,
  resumeLink,
  sideProjects,
  testimonialsData,
} from '@/data/site';
import { getAllPosts } from '@/lib/posts';

const DEMOS = { gym: GymDemo, pg: PgDemo };
const NUMERALS = ['i.', 'ii.', 'iii.'];

function ResumeButton({ className = 'btn btn-primary btn-lg' }) {
  return (
    <a className={className} href={resumeLink.href} {...(resumeLink.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {resumeLink.label}
    </a>
  );
}

function Hero() {
  return (
    <div className="dark">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="status">
              <span className="dot" aria-hidden="true" />
              {heroData.status}
            </p>
            <h1>
              I build the data platforms <span className="serif">and</span> the products that run on them.
            </h1>
            <p className="hero-lede">{heroData.lede}</p>
            <div className="hero-actions">
              <ResumeButton />
              <a className="btn btn-ghost-dark btn-lg" href="#experience">
                See my experience
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

          <div className="hero-visual">
            <figure className="hero-photo">
              <img
                src={profile.photo}
                alt={`Illustration of ${profile.name} at a desk with a laptop`}
                width="900"
                height="900"
                fetchPriority="high"
              />
            </figure>
            <div className="ledger">
              <div className="ledger-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
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
        </div>
      </section>

      <div className="previously">
        <div className="container previously-row">
          <span className="previously-label">Previously at</span>
          <ul>
            {previousCompanies.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function WhatIDo() {
  return (
    <section className="home-section" aria-labelledby="what-i-do">
      <div className="container">
        <p className="label">01 / What I do</p>
        <h2 id="what-i-do" className="h-section" style={{ marginBottom: 48, maxWidth: 760 }}>
          Three kinds of engineering, <span className="serif">one</span> engineer.
        </h2>
        <div className="pillars">
          {pillarsData.map((pillar, index) => (
            <Reveal key={pillar.title} className="pillar" delay={index * 60}>
              <span className="pillar-num" aria-hidden="true">
                {NUMERALS[index]}
              </span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <ul className="chips" aria-label="Tools">
                {pillar.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="home-section" aria-labelledby="experience-title">
      <div className="container exp">
        <div className="exp-intro">
          <p className="label">02 / Experience</p>
          <h2 id="experience-title" className="h-section">
            Where I have <span className="serif">shipped.</span>
          </h2>
          <p>Since 2018, on data teams in Bengaluru and France, from Hadoop ETL to lakehouse platforms.</p>
          <nav className="exp-jump" aria-label="Jump to role">
            <ul>
              {experienceData.map((job) => (
                <li key={job.id}>
                  <a href={`#exp-${job.id}`}>
                    {job.company}
                    <span>{job.short}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ResumeButton className="btn btn-ghost" />
        </div>

        <div className="exp-scroll" tabIndex={0} role="region" aria-label="Experience timeline, scrollable">
          <ol className="exp-list">
            {experienceData.map((job) => (
              <li key={job.id} id={`exp-${job.id}`} className="exp-item">
                <div className="exp-meta">
                  <span>{job.date}</span>
                  {job.place && <span>{job.place}</span>}
                </div>
                <h3>
                  {job.title} <span>· {job.company}</span>
                </h3>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className="chips" aria-label="Skills">
                  {job.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <div className="exp-fade" aria-hidden="true">
            <span>
              scroll
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function KindWords() {
  const [lead, ...rest] = testimonialsData;

  return (
    <section className="kind-words" aria-label="Recommendations">
      <div className="container kind-words-grid">
        <figure className="quote-lead">
          <svg width="44" height="34" viewBox="0 0 44 34" fill="currentColor" aria-hidden="true">
            <path d="M0 34V20C0 8 6 1 18 0v7c-6 1-9 5-9 11h9v16H0Zm26 0V20C26 8 32 1 44 0v7c-6 1-9 5-9 11h9v16H26Z" />
          </svg>
          <blockquote>“{lead.quote}”</blockquote>
          <figcaption>
            <strong>{lead.name}</strong> · {lead.role}
          </figcaption>
        </figure>
        <div className="quote-stack">
          {rest.map((item) => (
            <figure className="quote-card" key={item.name}>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                {item.name} · {item.role}
              </figcaption>
            </figure>
          ))}
          <a className="text-link" href={profile.linkedinRecommendations} target="_blank" rel="noreferrer">
            Read all {profile.recommendationCount} recommendations on LinkedIn →
          </a>
        </div>
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
          <h2 id="projects-title" className="h-section" style={{ maxWidth: 620 }}>
            Things I build <span className="serif">after hours</span>, and write about.
          </h2>
          <p>Real apps with real constraints: payments, concurrency, auth. The hard parts become blog posts.</p>
        </div>

        <div className="projects">
          {sideProjects.map((project, index) => {
            const Demo = DEMOS[project.demo];
            return (
              <Reveal as="article" key={project.name} className={`project${index === 0 ? ' dark' : ''}`} delay={index * 80}>
                <div className="project-frame">
                  <Demo />
                </div>
                <div className="project-body">
                  <ul className="project-tags">
                    <li>Side project</li>
                    <li>In progress</li>
                  </ul>
                  <h3>{project.name}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <p className="project-hard">
                    <em>Hard part →</em> {project.hardPart}{' '}
                    {project.post ? <Link href={project.post.href}>{project.post.label}</Link> : <span>(post coming)</span>}
                  </p>
                  <p className="project-stack">{project.stack.join(' · ')}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Writing({ posts, total }) {
  return (
    <section id="writing" className="home-section" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-row">
          <div>
            <p className="label">04 / Writing</p>
            <h2 id="writing-title" className="h-section">
              {total} posts on how things <span className="serif">actually</span> work.
            </h2>
          </div>
          <Link className="text-link" href="/blog/">
            All posts →
          </Link>
        </div>
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`}>
                <span className="posts-date">{post.date}</span>
                <span className="posts-title">{post.title}</span>
                {post.tags[0] && <span className="posts-tag">#{post.tags[0]}</span>}
              </Link>
            </li>
          ))}
        </ul>
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
              Hiring for a <span className="serif">data or full-stack</span> role?
            </h2>
            <p>Senior data engineering, platform or full-stack product roles. Remote or hybrid.</p>
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

  return (
    <main>
      <Hero />
      <WhatIDo />
      <Experience />
      <KindWords />
      <SideProjects />
      <Writing posts={posts.slice(0, 4)} total={posts.length} />
      <Contact />
    </main>
  );
}
